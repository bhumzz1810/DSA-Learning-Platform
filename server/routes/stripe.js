const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15", // specify Stripe API version explicitly
});

router.post("/create-checkout-session", async (req, res) => {
  const { userId, email, billing } = req.body;

  if (!userId || !email || !billing) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("👉 Incoming subscription request:", req.body);

  // Sanitize billing input strictly
  const allowedBilling = ["monthly", "yearly"];
  if (!allowedBilling.includes(billing)) {
    return res.status(400).json({ error: "Invalid billing type" });
  }

  const priceId =
    billing === "yearly"
      ? process.env.STRIPE_YEARLY_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID;

  try {
    // Check if customer with this email already exists in Stripe
    let customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
      },
      metadata: { userId },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});

module.exports = router;
