const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Preparing", "Out for Delivery", "Delivered"], 
      default: "Pending" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);