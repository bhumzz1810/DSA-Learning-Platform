const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const User = require("../models/User");
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
}
// GET all users (admin only)
router.get("/all", authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update user admin role
router.put(
  "/:id/role",
  authenticate,
  requireAdmin,
  validateObjectId,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
      }

      // 🚫 Prevent self-demotion
      if (req.params.id === String(req.user._id) && role !== "admin") {
        return res
          .status(400)
          .json({ error: "You cannot revoke your own admin rights." });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
    } catch (err) {
      console.error("Role update error:", err);
      res.status(500).json({ error: "Failed to update role" });
    }
  }
);

module.exports = router;
