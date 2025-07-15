const User = require("../models/User");

exports.addBookmark = async (req, res) => {
  const { problemId } = req.params;
  const user = await User.findById(req.user._id);

  if (user.bookmarks.includes(problemId)) {
    return res.status(400).json({ message: "Already bookmarked" });
  }

  user.bookmarks.push(problemId);
  await user.save();
  res.json({ message: "Bookmarked successfully" });
};

exports.removeBookmark = async (req, res) => {
  const { problemId } = req.params;
  const user = await User.findById(req.user._id);

  user.bookmarks = user.bookmarks.filter(
    (id) => id.toString() !== problemId.toString()
  );
  await user.save();
  res.json({ message: "Bookmark removed" });
};

exports.getBookmarks = async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookmarks");
  res.json({ bookmarks: user.bookmarks });
};
