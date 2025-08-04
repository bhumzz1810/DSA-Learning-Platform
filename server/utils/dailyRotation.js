const Problem = require("../models/Problem");

const rotateDailyChallenge = async () => {
  try {
    // Clear the old daily challenge(s)
    const clearResult = await Problem.updateMany(
      { isDaily: true },
      { $set: { isDaily: false } }
    );

    console.log(`🧹 Cleared ${clearResult.modifiedCount} previous daily challenge(s)`);

    // Pick a new random problem
    const [randomProblem] = await Problem.aggregate([{ $sample: { size: 1 } }]);

    if (randomProblem) {
      await Problem.findByIdAndUpdate(randomProblem._id, { isDaily: true });
      console.log("✅ New daily challenge selected:", randomProblem.title);
    } else {
      console.warn("⚠️ No problems found to set as daily challenge");
    }
  } catch (err) {
    console.error("❌ Failed to rotate daily challenge:", err);
  }
};

module.exports = rotateDailyChallenge;
