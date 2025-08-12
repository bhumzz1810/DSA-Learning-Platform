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

    // Always base endDate on currentPeriodStart
    const startDate = new Date(subscription.currentPeriodStart);
    if (Number.isNaN(startDate.getTime())) {
      return res.status(403).json({ error: "Subscription expired" });
    }

    let endDate;
    if (subscription.planName === "monthly") {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (
      subscription.planName === "yearly" ||
      subscription.planName === "annual"
    ) {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      // fallback if unknown plan
      endDate = new Date(startDate);
    }

    // Expiry check
    if (endDate <= new Date()) {
      return res.status(403).json({ error: "Subscription expired" });
    }

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
