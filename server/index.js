const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http"); // <-- 1. Import Node's native HTTP module
const { Server } = require("socket.io"); // <-- 2. Import Socket.io
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 5001;

// 3. Create an HTTP server and wrap the Express app
const server = http.createServer(app);

// 4. Initialize Socket.io with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your Vercel URL
    methods: ["GET", "POST", "PATCH"]
  }
});

// 5. Make 'io' available to all our routes
app.set("io", io);

// Listen for clients connecting
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const orderRoutes = require("./routes/orderRoutes"); 

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Mount Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders", orderRoutes); 
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Rasoria Backend Running with WebSockets!");
});

// 6. VERY IMPORTANT: Start 'server', not 'app'
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});