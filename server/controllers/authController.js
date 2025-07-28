const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
      !email || typeof email !== "string" ||
      !username || typeof username !== "string" ||
      !password || typeof password !== "string" || password.length < 6
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

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
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
