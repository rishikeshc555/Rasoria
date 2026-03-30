const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    date: { type: String, required: true }, // Can be changed to Date type later if strict querying is needed
    time: { type: String, required: true },
    guests: { type: String, required: true },
    message: { type: String, trim: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Reservation", reservationSchema);