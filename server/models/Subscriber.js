const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "unsubscribed"],
      default: "pending",
      index: true,
    },
    confirmToken: String, // for double opt-in
    unsubscribeToken: String, // for one-click unsubscribe
    subscribedAt: Date,
    unsubscribedAt: Date,
  },
  { timestamps: true }
);

SubscriberSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Subscriber", SubscriberSchema);
