// models/Category.js
import e from "express";
import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;