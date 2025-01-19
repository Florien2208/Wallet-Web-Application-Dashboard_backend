// routes/account.js
import express from "express";


import { authMiddleware } from "../auth/auth.js";
import Account from "../model/account.model.js";

const accountRouter = express.Router();
accountRouter.use(authMiddleware);
// Create new account
accountRouter.post("/",  async (req, res) => {
  try {
    const { name, type, balance } = req.body;

    // Create new account with authenticated user's ID
    const account = new Account({
      name,
      type,
      balance,
      userId: req.user._id,
    });

    await account.save();

    res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// Get all accounts for authenticated user
accountRouter.get("/", async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      accounts,
      total: accounts.length,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Get single account by ID
accountRouter.get("/:id",  async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
      });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Update account
accountRouter.put("/:id",  async (req, res) => {
  try {
    const updates = req.body;
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
      });
    }

    // Validate account type if it's being updated
    if (
      updates.type &&
      !["bank", "mobile_money", "cash"].includes(updates.type)
    ) {
      return res.status(400).json({
        error: "Invalid account type",
      });
    }

    // Update only allowed fields
    const allowedUpdates = ["name", "type", "balance"];
    Object.keys(updates).forEach((update) => {
      if (allowedUpdates.includes(update)) {
        account[update] = updates[update];
      }
    });

    await account.save();

    res.json({
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// Delete account
accountRouter.delete("/:id",  async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
      });
    }

    res.json({
      message: "Account deleted successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Get account balance
accountRouter.get("/:id/balance",  async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
      });
    }

    res.json({
      balance: account.balance,
      accountName: account.name,
      accountType: account.type,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Update account balance
accountRouter.patch("/:id/balance",  async (req, res) => {
  try {
    const { amount } = req.body;

    if (typeof amount !== "number") {
      return res.status(400).json({
        error: "Amount must be a number",
      });
    }

    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
      });
    }

    account.balance = amount;
    await account.save();

    res.json({
      message: "Balance updated successfully",
      newBalance: account.balance,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

export default accountRouter;
