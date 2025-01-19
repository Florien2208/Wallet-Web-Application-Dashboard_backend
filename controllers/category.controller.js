// controllers/categoryController.js

import Category from "../model/category.model.js";


const categoryController = {
  // Create category or subcategory
  async createCategory(req, res) {
    try {
      const { name, description, parentCategoryId } = req.body;
      const userId = req.user.id;

      const category = await Category.create({
        name,
        description,
        parentCategory: parentCategoryId || null,
        userId,
      });

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all categories with subcategories
  async getCategories(req, res) {
    try {
      const userId = req.user.id;
      const categories = await Category.find({
        userId,
        parentCategory: null,
      }).populate({
        path: "parentCategory",
        model: "Category",
      });

      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
export { categoryController };