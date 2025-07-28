const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const Subscription = require("../models/Subscription");

router.get("/status", authenticate, async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: { $in: ["active", "trialing"] },
    });

    if (!sub) {
      return res.json({ subscriptionActive: false });
    }

    let isActive = false;

    try {
      const startDate = new Date(sub.currentPeriodStart);
      let expectedEndDate = new Date(startDate);

      // Calculate subscription end date based on plan
      if (sub.planName === "monthly") {
        expectedEndDate.setMonth(expectedEndDate.getMonth() + 1);
      } else if (sub.planName === "yearly") {
        expectedEndDate.setFullYear(expectedEndDate.getFullYear() + 1);
      }

      isActive = expectedEndDate > new Date();
    } catch (dateErr) {
      console.error("Error calculating subscription expiry date:", dateErr);
    }

    return res.json({ subscriptionActive: isActive });
  } catch (err) {
    console.error("Subscription status error:", err);
    return res.status(500).json({ error: "Could not verify subscription" });
  }
});

module.exports = router;
