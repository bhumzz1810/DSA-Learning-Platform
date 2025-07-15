const User = require("../models/User");

exports.saveNote = async (req, res) => {
  const { problemId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Note content is required" });
  }

  const user = await User.findById(req.user._id);

  const existing = user.notes.find((n) => n.problemId.toString() === problemId);

  if (existing) {
    existing.content = content;
    existing.createdAt = new Date();
  } else {
    user.notes.push({ problemId, content });
  }

  await user.save();
  res.json({ message: "Note saved successfully" });
};

exports.getNote = async (req, res) => {
  const { problemId } = req.params;
  const user = await User.findById(req.user._id).lean();

  const note = user.notes.find((n) => n.problemId.toString() === problemId);

  res.json({ note: note || null });
};

exports.deleteNote = async (req, res) => {
  const { problemId } = req.params;
  const user = await User.findById(req.user._id);

  user.notes = user.notes.filter((n) => n.problemId.toString() !== problemId);

  await user.save();
  res.json({ message: "Note deleted" });
};
