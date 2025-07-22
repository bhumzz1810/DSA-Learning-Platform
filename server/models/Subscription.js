const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stripeCustomerId: { type: String, required: true },
  stripeSubscriptionId: { type: String, required: true },
  planName: { type: String },
  priceId: { type: String }, // Stripe price ID
  status: { type: String }, // active, trialing, canceled, etc.
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
