const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    // NEW: Allow users to save multiple delivery addresses
    savedAddresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        phone: { type: String, required: true },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);