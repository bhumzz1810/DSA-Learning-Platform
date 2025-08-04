const express = require("express");
const router = express.Router();
const QuizQuestion = require("../models/Question");
const { authenticate } = require("../middleware/auth");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

// Helper to check if user has active subscription
async function checkSubscriptionActive(userId) {
  const sub = await Subscription.findOne({
    userId,
    status: { $in: ["active", "trialing"] },
  });

  if (!sub) return false;

  const startDate = new Date(sub.currentPeriodStart);
  let expectedEndDate = new Date(startDate);

  if (sub.planName === "monthly") {
    expectedEndDate.setMonth(expectedEndDate.getMonth() + 1);
  } else if (sub.planName === "yearly") {
    expectedEndDate.setFullYear(expectedEndDate.getFullYear() + 1);
  }

  return expectedEndDate > new Date();
}

router.get("/question/random", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Initialize attemptedQuestionIds if undefined
    if (!user.attemptedQuestionIds) {
      user.attemptedQuestionIds = [];
    }

    const attemptedCount = user.attemptedQuestionsCount || 0;
    const hasSubscription = await checkSubscriptionActive(userId);

    const totalQuestionsCount = await QuizQuestion.countDocuments();

    // Reset attempted questions only if all are done
    if (user.attemptedQuestionIds.length >= totalQuestionsCount) {
      user.attemptedQuestionIds = [];
      await user.save();
    }

    const remainingQuestions = await QuizQuestion.find({
      _id: { $nin: user.attemptedQuestionIds },
    });

    if (remainingQuestions.length === 0) {
      return res.status(404).json({ error: "No new questions available." });
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const question = remainingQuestions[randomIndex];

    const limitReached = !hasSubscription && attemptedCount >= 20;

    return res.json({
      _id: question._id,
      question: question.question,
      options: question.options,
      explanation: question.explanation,
      category: question.category,
      limitReached, // 👈 Pass this to frontend for modal logic
    });
  } catch (error) {
    console.error("Error fetching random question:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// POST route to submit an answer
router.post("/submit", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId, selectedOption } = req.body;

    if (!questionId || !selectedOption) {
      return res.status(400).json({ error: "Missing questionId or selectedOption" });
    }

    const question = await QuizQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const isCorrect = question.answer === selectedOption;

    const update = {
      $addToSet: { attemptedQuestionIds: questionId },
      $inc: { attemptedQuestionsCount: 1 },
    };

    if (isCorrect) {
      update.$inc["quizStats.correct"] = 1;
    } else {
      update.$inc["quizStats.incorrect"] = 1;
    }


 // Get the updated user document after incrementing stats
    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });

    res.json({
      correct: isCorrect,
      explanation: question.explanation,
      quizStats: updatedUser.quizStats,  // send updated quizStats here
    });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
