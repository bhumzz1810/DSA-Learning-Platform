// models/Challenge.js
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  date: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Challenge", challengeSchema);
