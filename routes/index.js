import express from "express";
import TransactionRouter from "./transaction.routes.js";
import CategoryRouter from "./category.routes.js";
import BudgetRouter from "./budge.routes.js";
import authRoute from "./auth.routes.js";
import accountRouter from "./account.routes.js";



const apiRouter = express.Router();

apiRouter.use("/auth", authRoute);
apiRouter.use("/transactions", TransactionRouter);
apiRouter.use("/categories", CategoryRouter);
apiRouter.use("/budgets", BudgetRouter);
apiRouter.use("/account", accountRouter);


export default apiRouter;
