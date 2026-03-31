const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // NEW: Links this order directly to the User's account for Order History
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    // NEW: We structure the address so it perfectly matches the user's saved addresses
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    // NEW: Cash on Delivery or Pay on Delivery
    paymentMethod: {
      type: String,
      enum: ["COD", "POD"],
      required: true
    },
    // Keeping your existing items structure, but it's now ready for the frontend cart
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    // Adding "Accepted" to your existing statuses for the admin flow
    status: { 
      type: String, 
      enum: ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"], 
      default: "Pending" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);