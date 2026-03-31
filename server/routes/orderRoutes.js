const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// @route   POST /api/orders
// @desc    Create a new order from cart
router.post("/", async (req, res) => {
  try {
    const { user, items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const newOrder = new Order({
      user, 
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod
    });

    const savedOrder = await newOrder.save();

    // NEW: Grab the Socket.io instance and broadcast the event to the Admin
    const io = req.app.get("io");
    io.emit("newOrderReceived", savedOrder); // The admin panel will listen for this exact string!

    res.status(201).json({ success: true, order: savedOrder, orderId: savedOrder._id });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (for Admin Dashboard)
router.get("/", async (req, res) => {
  try {
    // Fetch all orders and sort by newest first (Excellent logic here!)
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
      
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true } 
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      // NEW CODE: Tell everyone connected that an order was updated!
      const io = req.app.get("io");
      io.emit("orderStatusUpdated", updatedOrder);
  
      res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Update Status Error:", error);
      res.status(500).json({ success: false, message: "Failed to update order status" });
    }
  });
  // @route   GET /api/orders/user/:userId
// @desc    Get all orders for a specific logged-in customer
router.get("/user/:userId", async (req, res) => {
  try {
    // Find orders where the 'user' field matches the customer's ID
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 }); // Sort by newest first
      
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch User Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user orders" });
  }
});

module.exports = router;