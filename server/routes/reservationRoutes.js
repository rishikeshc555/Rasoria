const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

// @route   POST /api/reservations
// @desc    Create a new reservation
router.post("/", async (req, res) => {
  try {
    const { name, email, date, time, guests, message } = req.body;

    // Basic Backend Validation
    if (!name || !email || !date || !time || !guests) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    const newReservation = new Reservation({
      name,
      email,
      date,
      time,
      guests,
      message,
    });

    await newReservation.save();
    
    res.status(201).json({ success: true, message: "Table reserved successfully!" });
  } catch (error) {
    console.error("Reservation Error:", error);
    res.status(500).json({ success: false, message: "Server Error. Please try again." });
  }
});

module.exports = router;