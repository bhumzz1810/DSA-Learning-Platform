const Subscription = require("../models/Subscription");

const checkSubscription = async (req, res, next) => {
  console.log("Checking subscription for user:", req.user._id);

  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: { $in: ["active", "trialing"] },
    });

    if (!subscription) {
      return res.status(403).json({ error: "Subscription required" });
    }

    // If Stripe didn't provide currentPeriodEnd correctly, calculate it manually
    const startDate = new Date(subscription.currentPeriodStart);
    let expectedEndDate = new Date(startDate);

    if (subscription.planName === "monthly") {
      expectedEndDate.setMonth(expectedEndDate.getMonth() + 1);
    } else if (subscription.planName === "yearly") {
      expectedEndDate.setFullYear(expectedEndDate.getFullYear() + 1);
    }

    const isValid = expectedEndDate > new Date();

    if (!isValid) {
      return res.status(403).json({ error: "Subscription expired" });
    }

    next();
  } catch (err) {
    console.error("Subscription check failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkSubscription;
