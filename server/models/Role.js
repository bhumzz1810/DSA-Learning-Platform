// models/Role.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["admin", "moderator", "user"], default: "user" },
});

module.exports = mongoose.model("Role", roleSchema);
