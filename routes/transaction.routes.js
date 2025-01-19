
import express from "express";
import transactionController from "../controllers/transaction.controller.js";
import { authMiddleware } from "../auth/auth.js";


const TransactionRouter = express.Router();
TransactionRouter.use(authMiddleware);

TransactionRouter.post(
  "/",

  transactionController.createTransaction
);
TransactionRouter.get(
  "/",

  transactionController.getTransactions
);
TransactionRouter.get(
  "/summary",

  transactionController.getTransactionsSummary
);


export default TransactionRouter;
