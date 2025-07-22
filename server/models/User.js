// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Submission = require("../models/Submission");

const noteSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false },
  googleId: String,
  githubId: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  solvedProblems: [
    {
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
      problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
      solvedAt: { type: Date, default: Date.now },
    },
  ],

  badges: [String],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  notes: [noteSchema],
  streak: { type: Number, default: 0 },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  subscribed: { type: Boolean, default: false },
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

// 🔄 Award XP and Level Up
userSchema.methods.awardXpForProblem = function (
  problemId,
  xpPerProblem = 100
) {
  // Check if problem was already solved
  if (
    !this.solvedProblems.some(
      (p) => p.problemId.toString() === problemId.toString()
    )
  ) {
    this.solvedProblems.push(problemId);
    this.xp += xpPerProblem;

    // Calculate level (e.g., every 500 XP = new level)
    this.level = Math.floor(this.xp / 500) + 1;

    return true; // Means update happened
  }
  return false; // Already solved, no update
};

userSchema.methods.updateBadges = async function () {
  const solved = this.solvedProblems.length;
  const xp = this.xp;
  const streak = this.streak || 0;
  const badges = new Set(this.badges);

  // Problem count
  if (solved >= 1) badges.add("First Problem");
  if (solved >= 5) badges.add("DSA Explorer");
  if (solved >= 10) badges.add("DSA Warrior");

  // XP-based
  if (xp >= 100) badges.add("XP Rookie");
  if (xp >= 500) badges.add("XP Master");

  // Streak
  if (streak >= 3) badges.add("3-Day Streak");
  if (streak >= 7) badges.add("7-Day Streak");

  // Difficulty-based (optional, needs aggregation)
  const submissions = await Submission.find({
    userId: this._id,
    status: "Accepted",
  }).populate("problemId");

  const counts = { Easy: 0, Medium: 0, Hard: 0 };

  for (let sub of submissions) {
    const level = sub.problemId?.difficulty;
    if (counts[level] !== undefined) counts[level]++;
  }

  if (counts.Easy >= 3) badges.add("Easy Solver");
  if (counts.Medium >= 3) badges.add("Medium Challenger");
  if (counts.Hard >= 1) badges.add("Hard Hitter");

  this.badges = Array.from(badges);
  await this.save();
};

module.exports = mongoose.model("User", userSchema);
