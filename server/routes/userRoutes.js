const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const User = require("../models/User");

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

module.exports = router;
