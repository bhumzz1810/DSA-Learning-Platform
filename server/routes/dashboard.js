const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const User = require("../models/User");
const Submission = require("../models/Submission");
const Subscription = require("../models/Subscription");

// GET /api/dashboard
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    // Fetch current user with problem info
    const user = await User.findById(req.user._id)
      .populate("solvedProblems.problemId", "title category difficulty")
      .lean();

    const solved = user.solvedProblems || [];

    // Recent 3 solved
    const recentSolved = solved
      .sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt))
      .slice(0, 3)
      .map((s) => ({
        title: s.problemId?.title || "Untitled",
        category: s.problemId?.category || "-",
        difficulty: s.problemId?.difficulty || "-",
        solvedAt: s.solvedAt,
      }));

    // Get subscription data
    const subscriptionData = await Subscription.findOne({ 
      userId: req.user._id,
      status: { $in: ['active', 'trialing', 'past_due'] }
    }).sort({ currentPeriodEnd: -1 }).lean();

    let subscription = null;
    if (subscriptionData) {
      // Format plan name for display
      let planName;
      switch(subscriptionData.planName) {
        case 'monthly':
          planName = 'Monthly Premium';
          break;
        case 'annual':
          planName = 'Annual Premium';
          break;
        default:
          planName = subscriptionData.planName;
      }

      subscription = {
        plan: planName,
        status: subscriptionData.status,
        startDate: subscriptionData.currentPeriodStart,
        endDate: subscriptionData.currentPeriodEnd,
        isActive: ['active', 'trialing'].includes(subscriptionData.status)
      };
    }

    // Leaderboard users
    const allUsers = await User.find({})
      .select("username xp level solvedProblems")
      .lean()
      .sort({ xp: -1 });

    const topUsers = allUsers.slice(0, 10).map((u) => ({
      username: u.username,
      xp: u.xp,
      level: u.level,
      totalSolved: u.solvedProblems?.length || 0,
    }));

    const yourRank =
      allUsers.findIndex((u) => u._id.toString() === req.user._id.toString()) +
      1;

    // Prepare response
    const response = {
      user: {
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges,
        createdAt: user.createdAt,
        totalSolved: solved.length,
        recentSolved,
      },
      leaderboard: {
        topUsers,
        yourRank,
      }
    };

    // Only include subscription if it exists
    if (subscription) {
      response.user.subscription = subscription;
    }

    res.json(response);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

// GET /api/dashboard/solved-problems
router.get("/solved-problems", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    const solved = user.solvedProblems || [];
    const submissionIds = solved.map((s) => s.submissionId);

    // Fetch submission details and populate problem info
    const submissions = await Submission.find({ _id: { $in: submissionIds } })
      .populate("problemId", "title category difficulty")
      .sort({ submittedAt: -1 })
      .lean();

    const results = submissions.map((sub) => ({
      title: sub.problemId?.title || "Unknown",
      category: sub.problemId?.category || "-",
      difficulty: sub.problemId?.difficulty || "-",
      code: sub.code,
      language: sub.language,
      status: sub.status,
      runtime: sub.runtime,
      memory: sub.memory,
      submittedAt: sub.submittedAt,
    }));

    res.json({ total: results.length, problems: results });
  } catch (err) {
    console.error("Solved problems error:", err);
    res.status(500).json({ error: "Failed to load solved problems" });
  }
});

// GET /api/dashboard/submissions/latest/:problemId
router.get("/submissions/latest/:problemId", authenticate, async (req, res) => {
  try {
    const { problemId } = req.params;

    const latestSubmission = await Submission.findOne({
      userId: req.user._id,
      problemId,
    })
      .sort({ submittedAt: -1 })
      .lean();

    if (!latestSubmission) {
      return res.json({ code: "", language: "javascript" });
    }

    res.json({
      code: latestSubmission.code,
      language: latestSubmission.language,
      status: latestSubmission.status,
    });
  } catch (err) {
    console.error("Latest submission error:", err);
    res.status(500).json({ error: "Failed to fetch latest submission" });
  }
});

module.exports = router;