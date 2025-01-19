// routes/categoryRoutes.js
import express from "express";
import { categoryController } from "../controllers/category.controller.js";
import { authMiddleware } from "../auth/auth.js";


const CategoryRouter = express.Router();

CategoryRouter.use(authMiddleware)
// Category routes
CategoryRouter.post(
  "/",
 
  categoryController.createCategory
);
CategoryRouter.get(
  "/",
  
  categoryController.getCategories
);


export default CategoryRouter;
