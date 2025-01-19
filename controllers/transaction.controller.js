import Account from "../model/account.model.js";
import Budget from "../model/budge.model.js";
import Category from "../model/category.model.js";
import Transaction from "../model/transaction.model.js";



const transactionController = {
  // Create a new transaction
  async createTransaction(req, res) {
    try {
      const { type, amount, description, categoryId, accountId } = req.body;
      const userId = req.user.id;

      // Check if account exists
      const account = await Account.findOne({ _id: accountId, userId });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Create transaction
      const transaction = await Transaction.create({
        type,
        amount,
        description,
        category: categoryId,
        account: accountId,
        userId,
      });

      // Update account balance
      const balanceChange = type === "income" ? amount : -amount;
      account.balance += balanceChange;
      await account.save();

      // Check budget limits
      if (type === "expense") {
        const category = await Category.findById(categoryId);
        const activeBudgets = await Budget.find({
          userId,
          category: category._id,
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() },
        });

        for (const budget of activeBudgets) {
          const totalExpenses = await Transaction.aggregate([
            {
              $match: {
                userId,
                type: "expense",
                category: category._id,
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
              message: `Budget exceeded for ${category.name}`,
              date: new Date(),
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

  // Get transactions with filters
  async getTransactions(req, res) {
    try {
      const { startDate, endDate, categoryId, accountId, type } = req.query;
      const userId = req.user.id;

      const query = { userId };
      if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
      if (categoryId) query.category = categoryId;
      if (accountId) query.account = accountId;
      if (type) query.type = type;

      const transactions = await Transaction.find(query)
        .populate("category")
        .populate("account")
        .sort({ date: -1 });

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get transaction summary
  async getTransactionsSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;

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
            },
            total: { $sum: "$amount" },
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
      ]);

      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default transactionController;