const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// @route   POST /api/orders
// @desc    Create a new order from cart
router.post("/", async (req, res) => {
  try {
    // We now expect email, phone, and address from the frontend
    const { items, totalAmount, customerName, email, phone, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const newOrder = new Order({
      customerName,
      email,
      phone,
      address,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (for Admin Dashboard)
router.get("/", async (req, res) => {
  try {
    // Fetch all orders and sort by newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});
// @route   PATCH /api/orders/:id/status
// @desc    Update the status of an order
router.patch("/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      // Find the order by ID and update its status
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true } // This tells Mongoose to return the updated document
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
  
      res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Update Status Error:", error);
      res.status(500).json({ success: false, message: "Failed to update order status" });
    }
  });

module.exports = router;