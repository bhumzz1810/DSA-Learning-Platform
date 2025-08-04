const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, // optional
  quizTitle: { type: String },
  questionsAttempted: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  lastAttemptedAt: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);