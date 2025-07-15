const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  code: { type: String, required: true },
  language: { type: String, default: "javascript" },
  status: { type: String, default: "Pending" },
  runtime: { type: String, default: "-" },
  memory: { type: String, default: "-" },
  submittedAt: { type: Date, default: Date.now },
});

// ✅ Prevent multiple accepted submissions per user/problem
submissionSchema.index(
  { userId: 1, problemId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "Accepted" } }
);

// 🔍 Static method to check for existing accepted submission
submissionSchema.statics.alreadyAccepted = async function (userId, problemId) {
  return await this.exists({
    userId,
    problemId,
    status: "Accepted",
  });
};

module.exports = mongoose.model("Submission", submissionSchema);
