const express = require("express");
const Stripe = require("stripe");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use raw body for webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle session completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.error("❌ Missing userId in metadata.");
        return res.status(400).send("Missing userId in session metadata");
      }

      try {
        const subscriptionId = session.subscription;

        if (!subscriptionId) {
          console.error("❌ No subscription ID found in session");
          return res.status(400).send("No subscription ID in session");
        }
        const stripeSub = await stripe.subscriptions.retrieve(
          session.subscription
        );

        const startUnix =
          stripeSub.start_date || stripeSub.current_period_start;
        const endUnix =
          stripeSub.billing_cycle_anchor || stripeSub.current_period_end;

        if (!startUnix || !endUnix || isNaN(startUnix) || isNaN(endUnix)) {
          console.error("❌ Invalid subscription period timestamps.");
          return res.status(400).send("Invalid subscription period timestamps");
        }

        const newSub = new Subscription({
          userId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          planName: stripeSub.items.data[0]?.price.nickname || "Premium Plan",
          priceId: stripeSub.items.data[0]?.price.id,
          status: stripeSub.status,
          currentPeriodStart: new Date(startUnix * 1000),
          currentPeriodEnd: new Date(endUnix * 1000),
        });

        await newSub.save();

        await User.findByIdAndUpdate(userId, {
          subscribed: true,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        });

        console.log("✅ Subscription created and user updated.");
      } catch (error) {
        console.error("❌ Error handling subscription:", error.message);
        return res.status(500).send("Failed to save subscription");
      }
    }

    res.sendStatus(200);
  }
);

module.exports = router;
