const express = require("express");
const Stripe = require("stripe");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("📥 Received Stripe webhook");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Webhook verified:", event.type);
    } catch (err) {
      console.error("❌ Signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      console.log("🎯 Event: checkout.session.completed");

      const session = event.data.object;
      const userId = session.metadata?.userId;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      if (!userId) {
        console.error("❌ Missing userId in session metadata");
        return res.status(400).send("Missing userId");
      }

      try {
        const stripeSub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["latest_invoice", "items.data.price"],
        });

        const startUnix =
          stripeSub.start_date || stripeSub.current_period_start;
        const endUnix =
          stripeSub.billing_cycle_anchor || stripeSub.current_period_end;

        const newSub = new Subscription({
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          planName: stripeSub.items.data[0]?.price.nickname || "Premium Plan",
          priceId: stripeSub.items.data[0]?.price.id,
          status: stripeSub.status,
          currentPeriodStart: new Date(startUnix * 1000),
          currentPeriodEnd: new Date(endUnix * 1000),
        });

        await newSub.save();
        await User.findByIdAndUpdate(userId, {
          subscribed: true,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
        });

        console.log("✅ Saved subscription + updated user");
      } catch (err) {
        console.error("❌ Error saving to DB:", err.message);
        return res.status(500).send("Subscription error");
      }
    }

    res.sendStatus(200);
  }
);

module.exports = router;
