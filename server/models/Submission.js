const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  // 👤 Common field
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 🧠 Coding submission fields (for coding problems)
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },
  code: { type: String },
  language: { type: String, default: "javascript" },
  status: { type: String, default: "Pending" },
  runtime: { type: String, default: "-" },
  memory: { type: String, default: "-" },

  // ❓ Quiz submission fields (for multiple-choice questions)
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  selectedOption: { type: String },
  isCorrect: { type: Boolean },
  explanationShown: { type: Boolean, default: false },

  // 📅 Timestamp for both types
  submittedAt: { type: Date, default: Date.now },
});

// ✅ Prevent duplicate Accepted submissions for same coding problem
submissionSchema.index(
  { userId: 1, problemId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "Accepted" } }
);

// 🔍 Static method for checking if already solved (for coding problems)
submissionSchema.statics.alreadyAccepted = async function (userId, problemId) {
  return await this.exists({
    userId,
    problemId,
    status: "Accepted",
  });
};

module.exports = mongoose.model("Submission", submissionSchema);
