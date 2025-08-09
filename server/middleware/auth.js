// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization") || req.get("authorization");
    if (!authHeader)
      return res.status(401).json({ error: "Authorization header missing" });

    const [scheme, token] = authHeader.split(" ");
    if (!token || !/^Bearer$/i.test(scheme)) {
      return res
        .status(401)
        .json({ error: "Invalid Authorization header format" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // ensure role is loaded
    const user = await User.findById(decoded.id).select(
      "+role -passwordHash -__v"
    );
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
