const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 4 && v.every(opt => typeof opt === 'string' && opt.trim().length > 0);
        },
        message: "Options must be an array of 4 non-empty strings.",
      },
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (val) {
          // Answer must be one of the options
          return this.options.includes(val);
        },
        message: "Answer must be one of the options",
      },
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["JavaScript", "React", "Node.js", "MongoDB", "Frontend", "Backend"],
      required: true,
      index: true, // index for efficient filtering by category
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient sampling by category and sorting by recent creation
questionSchema.index({ question: 1 },{ category: 1, createdAt: -1 } ,{ unique: true, collation: { locale: "en", strength: 2 } });


module.exports = mongoose.model("Question", questionSchema);
