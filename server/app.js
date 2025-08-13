const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const connectDB = require("./config/db");
const session = require("express-session");
const passport = require("passport");
const cron = require("node-cron");

// Optional hardening
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);
const setupSocketServer = require("./socketHandler");

const PROD = process.env.NODE_ENV === "production";

// --- Trust proxy for HTTPS cookies behind Render/NGINX ---
if (PROD) app.set("trust proxy", 1);

// --- Security & perf (optional but recommended) ---
app.use(helmet());
app.use(compression());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Stripe webhook must be BEFORE any JSON body parser ---
app.use("/api/stripe", require("./routes/webhook")); // router should use express.raw()

// --- CORS ---
const allowedOrigins = [
  process.env.CLIENT_URL || "https://dsa-learning-platform-five.vercel.app/", // Vercel in prod; Vite in dev
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
  })
);
app.options("*", cors());

// --- Parsers & DB ---
app.use(express.json({ limit: "1mb" }));
connectDB();

// --- Sessions for OAuth handshakes (JWT used for APIs) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some_super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: PROD, // HTTPS only in prod
      sameSite: PROD ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// --- Health & root ---
app.get("/health", (req, res) => res.status(200).send("ok"));
app.get("/", (req, res) => res.send("DSA Platform API is running"));

// --- Dev-only routes ---
if (!PROD) app.use("/api/dev", require("./routes/devMail"));

// --- Cron (rotate at midnight Toronto) ---
const rotateDailyChallenge = require("./utils/dailyRotation");
cron.schedule(
  "0 0 * * *",
  () => {
    console.log("🔁 Rotating daily challenge...");
    rotateDailyChallenge();
  },
  { timezone: "America/Toronto" }
);
rotateDailyChallenge(); // once on boot

// --- Routers ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/authStatus"));
app.use("/auth", require("./routes/socialAuth"));
app.use("/api/suggest", require("./routes/suggest"));
app.use("/api/problems", require("./routes/problemRoutes"));
app.use("/api/judge", require("./routes/judgeRoutes"));
app.use("/api/submissions", require("./routes/submissionsRoutes"));
// Mount dashboard router ONCE (it exposes its own subpaths)
app.use("/api", require("./routes/dashboard"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/bookmarks", require("./routes/bookmarkRoutes"));
app.use("/api", require("./routes/dailyChallenge"));
app.use("/api/stripe", require("./routes/stripe.js"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// --- Socket.IO (make sure socketHandler CORS matches CLIENT_URL) ---
setupSocketServer(server);

// --- 404 & Error handlers ---
app.use((req, res, next) => {
  if (!res.headersSent) return res.status(404).json({ error: "Not found" });
  next();
});
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal server error" });
});

// --- Boot ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready at ws://localhost:${PORT}/socket.io/`);
});

// --- Graceful shutdown ---
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  server.close(() => process.exit(0));
});
