// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const noteSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  badges: [String],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  notes: [noteSchema],
  streak: { type: Number, default: 0 },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
});

// 🔐 Hashing logic
userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
