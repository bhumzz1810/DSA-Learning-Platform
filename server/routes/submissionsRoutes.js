const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

// POST /api/submissions
router.post("/", authenticate, async (req, res) => {
  try {
    const { problemId, code, language, status, runtime, memory } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const problem = await Problem.findById(problemId);

    const alreadyAccepted = await Submission.alreadyAccepted(
      req.user._id,
      problemId
    );
    // ❌ Prevent duplicate solves for daily challenge
    if (problem?.isDaily && alreadyAccepted) {
      return res.status(400).json({
        error:
          "You’ve already solved today’s Daily Challenge. Try again tomorrow!",
      });
    }

    const submission = new Submission({
      userId: req.user._id,
      problemId,
      code,
      language: language || "javascript",
      status: status || "Pending",
      runtime: runtime || "-",
      memory: memory || "-",
      submittedAt: new Date(),
    });

    try {
      await submission.save();

      if (status === "Accepted" && !alreadyAccepted) {
        req.user.xp += 100;
        req.user.level = Math.floor(req.user.xp / 500) + 1;
        console.log(submission._id, problemId);

        req.user.solvedProblems.push({
          submissionId: submission._id,
          problemId,
          solvedAt: new Date(),
        });

        // 🔥 Streak Calculation
        const now = new Date();
        const last = req.user.lastLogin;

        if (last) {
          const lastDate = new Date(last).setHours(0, 0, 0, 0);
          const today = new Date().setHours(0, 0, 0, 0);
          const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);

          if (diffDays === 1) {
            req.user.streak += 1;
          } else if (diffDays > 1) {
            req.user.streak = 1;
          }
        } else {
          req.user.streak = 1;
        }

        req.user.lastLogin = now;
        await req.user.save();
        await req.user.updateBadges();
      }
    } catch (e) {
      if (e.code === 11000 && status === "Accepted") {
        return res.status(409).json({
          message:
            "You already submitted an accepted solution for this problem.",
        });
      }
      throw e;
    }



    res.status(201).json({ message: "Submission saved successfully" });
  } catch (err) {
    console.error("Submission save error:", err);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

module.exports = router;
