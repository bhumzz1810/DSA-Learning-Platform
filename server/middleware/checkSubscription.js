const Subscription = require("../models/Subscription");

const checkSubscription = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: { $in: ["active", "trialing"] },
    });

    if (!subscription) {
      return res.status(403).json({ error: "Subscription required" });
    }

    // Prefer stored currentPeriodEnd when valid; otherwise compute
    let endDate = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : null;

    if (!endDate || Number.isNaN(endDate.getTime())) {
      const startDate = new Date(subscription.currentPeriodStart);
      if (Number.isNaN(startDate.getTime())) {
        return res.status(403).json({ error: "Subscription expired" });
      }

      if (subscription.planName === "monthly") {
        startDate.setMonth(startDate.getMonth() + 1);
      } else if (
        subscription.planName === "yearly" ||
        subscription.planName === "annual"
      ) {
        startDate.setFullYear(startDate.getFullYear() + 1);
      }
      endDate = startDate;
    }

    if (endDate <= new Date()) {
      return res.status(403).json({ error: "Subscription expired" });
    }

    // Optional: expose for downstream handlers
    req.subscription = {
      planName: subscription.planName,
      currentPeriodEnd: endDate,
      status: subscription.status,
    };

    next();
  } catch (err) {
    console.error("Subscription check failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkSubscription;
