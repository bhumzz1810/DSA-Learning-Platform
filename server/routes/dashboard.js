const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const User = require("../models/User");
const Submission = require("../models/Submission");
const Subscription = require("../models/Subscription");
const QuizAttempt = require("../models/QuizAttempt");
const mongoose = require("mongoose");

function validateObjectId(req, res, next) {
  if (req.params.problemId && !mongoose.Types.ObjectId.isValid(req.params.problemId)) {
    return res.status(400).json({ error: "Invalid problemId parameter" });
  }
  next();
}

// GET /api/dashboard
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    // Fetch current user with problem info
    const user = await User.findById(req.user._id)
      .populate("solvedProblems.problemId", "title category difficulty")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch last 5 quiz attempts
    const quizAttempts = await QuizAttempt.find({ userId: req.user._id })
      .sort({ lastAttemptedAt: -1 })
      .limit(5)
      .lean();

    const quizData = quizAttempts.map(qa => ({
      quizTitle: qa.quizTitle || "Untitled Quiz",
      questionsAttempted: qa.questionsAttempted,
      correctAnswers: qa.correctAnswers,
      lastAttemptedAt: qa.lastAttemptedAt,
    }));

    const solved = user.solvedProblems || [];

    // Recent 3 solved problems
    const recentSolved = solved
      .sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt))
      .slice(0, 3)
      .map(s => ({
        title: s.problemId?.title || "Untitled",
        category: s.problemId?.category || "-",
        difficulty: s.problemId?.difficulty || "-",
        solvedAt: s.solvedAt,
      }));

    // Get subscription data
    const subscriptionData = await Subscription.findOne({
      userId: req.user._id,
      status: { $in: ["active", "trialing", "past_due"] },
    })
      .sort({ currentPeriodEnd: -1 })
      .lean();

    let subscription = null;
    if (subscriptionData) {
      let planName;
      switch (subscriptionData.planName) {
        case "monthly":
          planName = "Monthly Premium";
          break;
        case "annual":
          planName = "Annual Premium";
          break;
        default:
          planName = subscriptionData.planName;
      }

      subscription = {
        plan: planName,
        status: subscriptionData.status,
        startDate: subscriptionData.currentPeriodStart,
        endDate: subscriptionData.currentPeriodEnd,
        isActive: ["active", "trialing"].includes(subscriptionData.status),
      };
    }

    // Leaderboard users - top 10 by XP
    const topUsers = await User.find({})
      .select("username xp level solvedProblems")
      .sort({ xp: -1 })
      .limit(10)
      .lean();

    const leaderboard = topUsers.map(u => ({
      username: u.username,
      xp: u.xp,
      level: u.level,
      totalSolved: u.solvedProblems?.length || 0,
    }));

    // Get current user's rank (1-based)
    const yourRank = (await User.countDocuments({ xp: { $gt: user.xp } })) + 1;

    // Calculate total quiz stats from quizAttempts
    // Use stored quizStats from user
    const totalCorrect = user.quizStats?.correct || 0;
    const totalIncorrect = user.quizStats?.incorrect || 0;


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
        quizAttempts: user.attemptedQuestionsCount || 0,
      },
      leaderboard: {
        topUsers: leaderboard,
        yourRank,
      },
      quizStats: {
        totalCorrect,
        totalIncorrect,
      },
    };

    if (subscription) {
      response.user.subscription = subscription;
    }

    res.json(response);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

// Other routes remain unchanged...

module.exports = router;
