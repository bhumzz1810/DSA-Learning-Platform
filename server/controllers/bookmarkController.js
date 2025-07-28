const User = require("../models/User");

exports.addBookmark = async (req, res) => {
  try {
    const { problemId } = req.params;
    if (!problemId) return res.status(400).json({ message: "Problem ID required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.bookmarks.some(id => id.toString() === problemId)) {
      return res.status(400).json({ message: "Already bookmarked" });
    }

    user.bookmarks.push(problemId);
    await user.save();

    res.json({ message: "Bookmarked successfully" });
  } catch (err) {
    console.error("Add bookmark error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    const { problemId } = req.params;
    if (!problemId) return res.status(400).json({ message: "Problem ID required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== problemId.toString()
    );
    await user.save();

    res.json({ message: "Bookmark removed" });
  } catch (err) {
    console.error("Remove bookmark error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("bookmarks");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    console.error("Get bookmarks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
