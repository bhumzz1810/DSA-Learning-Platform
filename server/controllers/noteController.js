const User = require("../models/User");

exports.saveNote = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { content } = req.body;

    if (!content || !problemId) {
      return res.status(400).json({ message: "Problem ID and note content are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = user.notes.find((n) => n.problemId.toString() === problemId);

    if (existing) {
      existing.content = content;
      existing.createdAt = new Date();
    } else {
      user.notes.push({ problemId, content });
    }

    await user.save();
    res.json({ message: "Note saved successfully" });
  } catch (err) {
    console.error("Save note error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNote = async (req, res) => {
  try {
    const { problemId } = req.params;
    if (!problemId) return res.status(400).json({ message: "Problem ID is required" });

    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const note = user.notes.find((n) => n.problemId.toString() === problemId);
    res.json({ note: note || null });
  } catch (err) {
    console.error("Get note error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { problemId } = req.params;
    if (!problemId) return res.status(400).json({ message: "Problem ID is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.notes = user.notes.filter((n) => n.problemId.toString() !== problemId);

    await user.save();
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
