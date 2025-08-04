const Subscription = require("../models/Subscription");

const checkSubscription = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    console.log("Checking subscription for user:", req.user._id);

    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: { $in: ["active", "trialing"] },
    });

    if (!subscription) {
      return res.status(403).json({ error: "Subscription required" });
    }

    const now = new Date();
    let endDate = subscription.currentPeriodEnd;

    // If currentPeriodEnd is missing or invalid, calculate manually
    if (!endDate || isNaN(new Date(endDate).getTime())) {
      const startDate = new Date(subscription.currentPeriodStart);
      if (subscription.planName === "monthly") {
        startDate.setMonth(startDate.getMonth() + 1);
      } else if (subscription.planName === "yearly") {
        startDate.setFullYear(startDate.getFullYear() + 1);
      }
      endDate = startDate;
    }

    if (new Date(endDate) <= now) {
      return res.status(403).json({ error: "Subscription expired" });
    }

    next();
  } catch (err) {
    console.error("Subscription check failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkSubscription;
