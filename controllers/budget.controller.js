// controllers/budgetController.js

import Budget from "../model/budge.model.js";


const budgetController = {
  // Create budget
  async createBudget(req, res) {
    try {
      const { amount, startDate, endDate, categoryId } = req.body;
      const userId = req.user.id;

      const budget = await Budget.create({
        amount,
        startDate,
        endDate,
        category: categoryId,
        userId,
      });

      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get budget notifications
  async getBudgetNotifications(req, res) {
    try {
      const userId = req.user.id;
      const budgets = await Budget.find({
        userId,
        "notifications.isRead": false,
      }).populate("category");

      const notifications = budgets.reduce((acc, budget) => {
        return [
          ...acc,
          ...budget.notifications
            .filter((n) => !n.isRead)
            .map((n) => ({
              ...n.toObject(),
              budgetId: budget._id,
              categoryName: budget.category.name,
            })),
        ];
      }, []);

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mark notification as read
  async markNotificationAsRead(req, res) {
    try {
      const { budgetId, notificationId } = req.params;
      const userId = req.user.id;

      const budget = await Budget.findOne({ _id: budgetId, userId });
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }

      const notification = budget.notifications.id(notificationId);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      notification.isRead = true;
      await budget.save();

      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { budgetController };