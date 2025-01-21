import Transaction from "../model/transaction.model.js";
import Category from "../model/category.model.js";
import Budget from "../model/budge.model.js";

const transactionController = {
  // Create a new transaction
  async createTransaction(req, res) {
    try {
      const { type, amount, description, categoryId, subCategoryId, account } =
        req.body;
      const userId = req.user.id;

      // Validate account type
      if (!["bank", "mobile_money", "cash"].includes(account)) {
        return res.status(400).json({ message: "Invalid account type" });
      }

      // Create transaction
      const transaction = await Transaction.create({
        type,
        amount,
        description,
        category: categoryId,
        subCategory: subCategoryId,
        account,
        userId,
      });

      // Check budget limits if it's an expense
      if (type === "expense") {
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }

        const activeBudgets = await Budget.find({
          userId,
          $or: [{ category: category._id }, { subCategory: subCategoryId }],
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() },
        });

        for (const budget of activeBudgets) {
          const totalExpenses = await Transaction.aggregate([
            {
              $match: {
                userId,
                type: "expense",
                $or: [
                  { category: budget.category },
                  { subCategory: budget.subCategory },
                ],
                date: { $gte: budget.startDate, $lte: budget.endDate },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]);

          if (totalExpenses[0]?.total > budget.amount) {
            budget.notifications.push({
              message: `Budget exceeded for ${category.name}${
                budget.subCategory ? ` - ${budget.subCategory.name}` : ""
              }`,
              date: new Date(),
              exceededAmount: totalExpenses[0].total - budget.amount,
            });
            await budget.save();
          }
        }
      }

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get transactions with enhanced filtering
  async getTransactions(req, res) {
    try {
      const {
        startDate,
        endDate,
        categoryId,
        subCategoryId,
        account,
        type,
        sort = "date",
      } = req.query;
      const userId = req.user.id;

      const query = { userId };
      if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
      if (categoryId) query.category = categoryId;
      if (subCategoryId) query.subCategory = subCategoryId;
      if (account) query.account = account;
      if (type) query.type = type;

      const transactions = await Transaction.find(query)
        .populate("category")
        .populate("subCategory")
        .sort({ [sort]: -1 });

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get detailed transaction summary with visualizable data
  async getTransactionsSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;

      // Get summary by category, subcategory, and account
      const summary = await Transaction.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: {
              type: "$type",
              category: "$category",
              subCategory: "$subCategory",
              account: "$account",
            },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
            averageAmount: { $avg: "$amount" },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id.category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "_id.subCategory",
            foreignField: "_id",
            as: "subCategory",
          },
        },
      ]);

      // Get timeline data for visualization
      const timelineData = await Transaction.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: { "_id.date": 1 },
        },
      ]);

      // Get account balances
      const accountBalances = await Transaction.aggregate([
        {
          $match: { userId },
        },
        {
          $group: {
            _id: "$account",
            balance: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "income"] },
                  "$amount",
                  { $multiply: ["$amount", -1] },
                ],
              },
            },
          },
        },
      ]);

      res.json({
        summary,
        timelineData,
        accountBalances,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get budget status and notifications
  async getBudgetStatus(req, res) {
    try {
      const userId = req.user.id;

      const activeBudgets = await Budget.find({
        userId,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      })
        .populate("category")
        .populate("subCategory");

      const budgetStatus = await Promise.all(
        activeBudgets.map(async (budget) => {
          const expenses = await Transaction.aggregate([
            {
              $match: {
                userId,
                type: "expense",
                $or: [
                  { category: budget.category._id },
                  { subCategory: budget.subCategory?._id },
                ],
                date: { $gte: budget.startDate, $lte: budget.endDate },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]);

          return {
            budget: {
              category: budget.category,
              subCategory: budget.subCategory,
              amount: budget.amount,
              startDate: budget.startDate,
              endDate: budget.endDate,
            },
            spent: expenses[0]?.total || 0,
            remaining: budget.amount - (expenses[0]?.total || 0),
            notifications: budget.notifications,
          };
        })
      );

      res.json(budgetStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default transactionController;
