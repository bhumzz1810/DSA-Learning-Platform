const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const { authenticate } = require("../middleware/auth"); // your auth middleware


// GET /api/problems/daily
router.get("/problems/daily", authenticate,async (req, res) => {
  try {
    const daily = await Problem.findOne({ isDaily: true, isArchived: false  });
    if (!daily) {
      return res.status(404).json({ error: "No daily challenge set" });
    }
    res.json(daily);
  } catch (err) {
    console.error("Failed to fetch daily challenge:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
