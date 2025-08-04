const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
    validate: {
      validator: function (v) {
        // Validate that ObjectId is valid
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: (props) => `${props.value} is not a valid Problem ID!`,
    },
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        // Date must not be in the past
        return v >= new Date().setHours(0, 0, 0, 0);
      },
      message: (props) => `Challenge date ${props.value} cannot be in the past!`,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Index to improve query performance for active challenges by date
challengeSchema.index({ isActive: 1, date: 1 });

module.exports = mongoose.model("Challenge", challengeSchema);
