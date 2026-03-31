const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http"); 
const { Server } = require("socket.io"); 
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 5001;

// 1. --- BULLETPROOF CORS SETUP ---
// List exactly who is allowed to talk to your backend. 
// Make sure your Vercel URL here matches exactly (no slash at the end!)
const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:5173",
  "https://rasoria.vercel.app" 
];

// 2. Apply Express Middleware FIRST
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true // Important for strict browser security
}));
app.use(express.json());

// 3. Create HTTP server
const server = http.createServer(app);

// 4. Initialize Socket.io with the EXACT SAME strict CORS settings
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
    credentials: true
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

// 6. Start 'server', not 'app'
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});