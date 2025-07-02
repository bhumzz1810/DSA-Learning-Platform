const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const suggestRoute = require("./routes/suggest");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

// Example route
app.get("/", (req, res) => {
  res.send("DSA Platform API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/suggest", suggestRoute);
app.use("/api/problems", problemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
