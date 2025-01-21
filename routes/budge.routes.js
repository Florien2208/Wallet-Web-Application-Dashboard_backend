// routes/categoryRoutes.js
import express from "express";
import { budgetController } from "../controllers/budget.controller.js";
import { authMiddleware } from "../auth/auth.js";

const BudgetRouter = express.Router();
BudgetRouter.use(authMiddleware);
// Budget routes
BudgetRouter.get("/", budgetController.getAllBudgets);
BudgetRouter.post("/", budgetController.createBudget);
BudgetRouter.get(
  "/notifications",

  budgetController.getBudgetNotifications
);
BudgetRouter.patch(
  "/:budgetId/notifications/:notificationId",

  budgetController.markNotificationAsRead
);


export default BudgetRouter;
