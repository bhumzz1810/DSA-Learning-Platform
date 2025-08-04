const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
    trim: true,
  },
  expectedOutput: {
    type: String,
    required: true,
    trim: true,
  },
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  constraints: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  testCases: {
    type: [testCaseSchema],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "At least one test case is required",
    },
  },
  hints: {
    type: [String],
    validate: {
      validator: (arr) => arr.every((h) => typeof h === "string" && h.trim() !== ""),
      message: "Hints must be non-empty strings",
    },
    default: [],
  },
  isDaily: {
    type: Boolean,
    default: false,
  },
  visualAid: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        // Optional URL validation regex
        return !v || /^https?:\/\/.+\.(gif|png|jpg|jpeg|svg)$/i.test(v);
      },
      message: (props) => `${props.value} is not a valid URL to an image/gif`,
    },
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: function (v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: (props) => `${props.value} is not a valid author ID`,
    },
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster lookups on common queries
problemSchema.index({ category: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ isDaily: 1, isArchived: 1 });

module.exports = mongoose.model("Problem", problemSchema);
