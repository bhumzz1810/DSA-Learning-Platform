const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");
const crypto = require("crypto");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role }, // ensure id is string
    process.env.JWT_SECRET,
    { expiresIn: "1y" }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Basic input validation (you can expand this or move to middleware)
    if (
      !email ||
      typeof email !== "string" ||
      !username ||
      typeof username !== "string" ||
      !password ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ email, username });
    await user.setPassword(password);
    await user.save();

    // Fire-and-forget welcome email (Mailtrap)
    // Send welcome email
    const welcomeHtml = `
      <h1>Welcome to ${process.env.APP_NAME}!</h1>
      <p>Hi ${username},</p>
      <p>Thanks for signing up. You can now log in and start solving problems!</p>
      <a href="${process.env.CLIENT_URL}">Go to Dashboard</a>
    `;
    await sendEmail(email, "Welcome to " + process.env.APP_NAME, welcomeHtml);
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/forgot
exports.forgot = async (req, res) => {
  const { email } = req.body;
  // Always respond OK to avoid user enumeration
  const user = await User.findOne({ email });
  if (!user) return res.json({ ok: true });

  // 32B raw token → hash stored in DB
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  user.resetPasswordToken = hash;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
  await user.save();

  // Use hash-router style link for your app
  const link = `${process.env.CLIENT_URL}/#/reset-password?token=${raw}`;

  const html = `
    <h2>Reset your password</h2>
    <p>Click the link below to set a new password (valid for 30 minutes):</p>
    <p><a href="${link}">${link}</a></p>
  `;

  try {
    await sendEmail(email, `Reset your ${process.env.APP_NAME} password`, html);
  } catch (e) {
    // still return ok to client
    console.warn("Forgot email send failed:", e.message);
  }
  return res.json({ ok: true });
};

// POST /api/auth/reset
exports.reset = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 6) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hash,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired link" });

  await user.setPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.passwordChangedAt = new Date(); // optional
  await user.save();

  return res.json({ ok: true });
};
