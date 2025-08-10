const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const setupSocketServer = require("./socketHandler"); // ✅ import socket handler

// Routes and config
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const suggestRoute = require("./routes/suggest");
const judgeRoutes = require("./routes/judgeRoutes");
const submissionsRoutes = require("./routes/submissionsRoutes");
const userDashboardRoutes = require("./routes/dashboard");
const noteRoutes = require("./routes/noteRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const passport = require("passport");
const socialAuthRoutes = require("./routes/socialAuth");
const dailyChallengeRoute = require("./routes/dailyChallenge");
const cron = require("node-cron");
const rotateDailyChallenge = require("./utils/dailyRotation");
const stripeRoutes = require("./routes/stripe.js");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");

// const webhookRoute = require("./routes/webhook");
// ✅ Correct route registration
app.use("/api/stripe", require("./routes/webhook"));

require("./config/passport");

const session = require("express-session");

// Middleware
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // <-- add these
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
connectDB();
rotateDailyChallenge(); // 🔁 rotate once on every restart for dev mode

app.use(
  session({
    secret: process.env.SESSION_SECRET || "some_super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Rotate challenge daily - FOR LIVE
cron.schedule("0 0 * * *", () => {
  console.log("🔁 Rotating daily challenge...");
  rotateDailyChallenge();
});

app.get("/", (req, res) => {
  res.send("DSA Platform API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/auth", socialAuthRoutes);
app.use("/api/suggest", suggestRoute);
app.use("/api/problems", problemRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api", userDashboardRoutes);
app.use("/api/solved-problems", userDashboardRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api", dailyChallengeRoute);
app.use("/api/stripe", stripeRoutes);
app.use("/api/auth", require("./routes/authStatus"));
app.use("/api/quiz", quizRoutes);
app.use("/api/user", userRoutes);
// Socket.IO Setup
setupSocketServer(server);

// Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready at ws://localhost:${PORT}/socket.io/`);
});
