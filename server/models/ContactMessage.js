// models/ContactMessage.js
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  message: String,
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("ContactMessage", schema);
