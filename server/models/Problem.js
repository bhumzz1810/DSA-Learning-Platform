// models/Problem.js
const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  constraints: String,
  testCases: [testCaseSchema],
  hints: [String],
  visualAid: String, // URL to a gif or animation
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Problem", problemSchema);
