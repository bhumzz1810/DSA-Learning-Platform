const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Submission = require("../models/Submission");

const noteSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    sparse: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "Invalid email format",
    },
  },
  passwordHash: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
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
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  passwordChangedAt: { type: Date }, // optional but nice to have

  attemptedQuestionsCount: { type: Number, default: 0 },
  attemptedQuestionIds: { type: [String], default: [] },
  profileImage: { type: String }, // Cloudinary secure_url
  profileImagePublicId: { type: String }, // Cloudinary public_id

  quizScores: [
    {
      score: { type: Number, default: 0 },
      date: { type: Date, default: Date.now },
      category: {
        type: String,
        enum: [
          "JavaScript",
          "React",
          "Node.js",
          "MongoDB",
          "Frontend",
          "Backend",
        ],
      },
    },
  ],

  quizStats: {
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
  },
});

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.awardXpForProblem = function (
  problemId,
  xpPerProblem = 100
) {
  if (
    !this.solvedProblems.some(
      (p) => p.problemId.toString() === problemId.toString()
    )
  ) {
    this.solvedProblems.push(problemId);
    this.xp += xpPerProblem;
    this.level = Math.floor(this.xp / 500) + 1;
    return true;
  }
  return false;
};

userSchema.methods.updateBadges = async function () {
  const solved = this.solvedProblems.length;
  const xp = this.xp;
  const streak = this.streak || 0;
  const badges = new Set(this.badges);

  if (solved >= 1) badges.add("First Problem");
  if (solved >= 5) badges.add("DSA Explorer");
  if (solved >= 10) badges.add("DSA Warrior");

  if (xp >= 100) badges.add("XP Rookie");
  if (xp >= 500) badges.add("XP Master");

  if (streak >= 3) badges.add("3-Day Streak");
  if (streak >= 7) badges.add("7-Day Streak");

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

// near schema bottom, before module.exports
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1, subscribed: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
