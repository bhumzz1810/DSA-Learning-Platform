const Problem = require("../models/Problem");

const rotateDailyChallenge = async () => {
  try {
    await Problem.updateMany({}, { $set: { isDaily: false } }); // Clear old one

    const random = await Problem.aggregate([{ $sample: { size: 1 } }]);
    if (random.length > 0) {
      await Problem.findByIdAndUpdate(random[0]._id, { isDaily: true });
      console.log("✅ New daily challenge selected:", random[0].title);
    }
  } catch (err) {
    console.error("❌ Failed to rotate daily challenge:", err);
  }
};

module.exports = rotateDailyChallenge;
