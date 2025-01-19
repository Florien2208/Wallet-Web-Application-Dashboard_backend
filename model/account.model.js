// models/Account.js

import mongoose from "mongoose";


const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["bank", "mobile_money", "cash"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;
