const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: (props) => `${props.value} is not a valid user ID`,
    },
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "user",
    required: true,
  },
}, {
  timestamps: true,  // Track creation and update times
});

// Add an index for faster lookup by userId
roleSchema.index({ userId: 1 });

module.exports = mongoose.model("Role", roleSchema);
