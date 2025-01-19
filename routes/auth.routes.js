// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../model/user.model.js";
import { authMiddleware } from "../auth/auth.js";


const authRoute = express.Router();

// Register new user
authRoute.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
authRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Logged in successfully",
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route example
authRoute.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default authRoute;
