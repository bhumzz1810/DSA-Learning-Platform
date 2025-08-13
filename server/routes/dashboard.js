const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const User = require("../models/User");
const Submission = require("../models/Submission");
const Subscription = require("../models/Subscription");
const QuizAttempt = require("../models/QuizAttempt");
const mongoose = require("mongoose");

function validateObjectId(req, res, next) {
  if (
    req.params.problemId &&
    !mongoose.Types.ObjectId.isValid(req.params.problemId)
  ) {
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

    const quizData = quizAttempts.map((qa) => ({
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
      .map((s) => ({
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

    // Top 10 with tie-breaker
    const topUsers = await User.find({})
      .select("username xp level solvedProblems _id")
      .sort({ xp: -1, _id: 1 })
      .limit(10)
      .lean();

    const leaderboard = topUsers.map((u) => ({
      username: u.username,
      xp: u.xp,
      level: u.level,
      totalSolved: u.solvedProblems?.length || 0,
    }));

    // Get current user's rank (1-based)
    const yourRank =
      (await User.countDocuments({
        $or: [
          { xp: { $gt: user.xp } },
          { xp: user.xp, _id: { $lt: user._id } },
        ],
      })) + 1;

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

// Other routes remain unchanged...

module.exports = router;
