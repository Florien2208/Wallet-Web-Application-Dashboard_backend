// models/Account.js

import mongoose from "mongoose";


const accountSchema = new mongoose.Schema(
  {
   
    name: {
      type: String,
      enum: ["bank", "mobile_money", "cash"],
      required: true,
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
