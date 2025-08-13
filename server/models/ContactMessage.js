const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    message: { type: String, required: true },
    ip: String,
    userAgent: String,
    status: {
      type: String,
      enum: ["received", "sent", "failed"],
      default: "received",
    },
    providerMessageId: String, // e.g., Resend email id
    error: String, // error text if send fails
  },
  { timestamps: true }
);

ContactMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);
