const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const User = require("../models/User");

function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
}

// GET /api/user/admin?q=ali&role=user&subscribed=true&page=1&limit=20&sortBy=createdAt&order=desc
router.get("/admin", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const {
      q,
      role,
      subscribed,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};
    if (q?.trim()) {
      const rx = new RegExp(
        q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [{ email: rx }, { username: rx }];
    }
    if (role) filter.role = role; // "user" | "admin"
    if (subscribed === "true") filter.subscribed = true;
    if (subscribed === "false") filter.subscribed = { $ne: true };

    const sort = { [sortBy]: order === "asc" ? 1 : -1 };

    const [items, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "_id email username role subscribed createdAt lastLogin xp level"
        )
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      sortBy,
      order,
      filter: {
        q: q || null,
        role: role || null,
        subscribed: subscribed || null,
      },
    });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/user/:id/role  body: { role: "admin" | "user" }
router.patch(
  "/:id/role",
  authenticate,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { role } },
        {
          new: true,
          runValidators: false,
          select:
            "_id email username role subscribed createdAt lastLogin xp level",
        }
      ).lean();
      if (!updated) return res.status(404).json({ error: "User not found" });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

// ✅ NEW: Get logged-in user profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

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

// PUT /api/user/update
router.put("/update", authenticate, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username?.trim())
      return res.status(400).json({ message: "Username required" });

    await User.findByIdAndUpdate(req.user.id, { username: username.trim() });
    res.json({ success: true, message: "Username updated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update username" });
  }
});

// PUT /api/user/update-photo
router.put("/update-photo", authenticate, async (req, res) => {
  try {
    const { photoUrl, publicId } = req.body;
    if (!photoUrl)
      return res.status(400).json({ message: "photoUrl required" });

    await User.findByIdAndUpdate(req.user.id, {
      profileImage: photoUrl,
      profileImagePublicId: publicId,
    });

    res.json({ success: true, message: "Photo updated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update photo" });
  }
});

router.put("/update", authenticate, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username;
    await user.save();

    res.json({
      message: "Username updated successfully",
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
