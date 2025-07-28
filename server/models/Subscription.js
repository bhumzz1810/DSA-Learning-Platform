const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: (props) => `${props.value} is not a valid user ID`,
    },
  },
  stripeCustomerId: {
    type: String,
    required: true,
    trim: true,
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
    trim: true,
  },
  planName: {
    type: String,
    enum: ["monthly", "yearly", "trial", "other"], // adjust as per your plans
    default: "other",
  },
  priceId: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "trialing", "canceled", "past_due", "unpaid", "paused"],
    default: "active",
  },
  currentPeriodStart: {
    type: Date,
    default: Date.now,
  },
  currentPeriodEnd: {
    type: Date,
    default: () => new Date(Date.now() + 30*24*60*60*1000), // default 30 days from now
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt timestamps automatically
});

// Index for quick lookups by userId and status
subscriptionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Subscription", subscriptionSchema);
