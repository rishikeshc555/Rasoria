const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 5001;
const authRoutes = require("./routes/authRoutes");

// Import Routes
const reservationRoutes = require("./routes/reservationRoutes");
const orderRoutes = require("./routes/orderRoutes"); // <-- Added order routes import

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
// Note: Removed deprecated options (useNewUrlParser/useUnifiedTopology) as they are default in Mongoose 6+
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection failed:", err));

// Mount Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders", orderRoutes); // <-- Mounted order routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Rasoria Backend Running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});