
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./src/routes/authRoute");
const transactionRoutes = require("./src/routes/transactionRoute");
const budgetRoutes = require("./src/routes/budgetRoute");
require("dotenv").config();
const app = express();

// DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
