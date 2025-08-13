const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const problemController = require("../controllers/problemController");
const { authenticate, requireAdmin } = require("../middleware/auth");
const Problem = require("../models/Problem");

// Middleware to validate MongoDB ObjectId
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
}

// GET /api/problems/admin?Page=1&limit=20&q=two&difficulty=easy&archived=false&sortBy=createdAt&order=desc
router.get("/admin", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const {
      q,
      difficulty,
      archived,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};
    if (q) {
      const rx = new RegExp(
        q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [{ title: rx }, { slug: rx }, { category: rx }];
    }
    if (difficulty) filter.difficulty = difficulty; // "easy" | "medium" | "hard"
    if (archived === "true") filter.isArchived = true;
    if (archived === "false") filter.isArchived = { $ne: true };

    const sort = { [sortBy]: order === "asc" ? 1 : -1 };

    const [items, total] = await Promise.all([
      Problem.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Problem.countDocuments(filter),
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
        difficulty: difficulty || null,
        archived: archived || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Anyone logged in can fetch problems
router.get("/", problemController.getAllProblems);
router.get("/:id", validateObjectId, problemController.getProblemById);

// ✅ Admin-only routes
router.post("/", authenticate, requireAdmin, problemController.createProblem);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateObjectId,
  problemController.updateProblem
);
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validateObjectId,
  problemController.deleteProblem
);
router.put(
  "/:id/restore",
  authenticate,
  requireAdmin,
  validateObjectId,
  problemController.restoreProblem
);

module.exports = router;
