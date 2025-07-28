const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const problemController = require("../controllers/problemController");
const { authenticate, requireAdmin } = require("../middleware/auth");

// Middleware to validate MongoDB ObjectId
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
}

// ✅ Anyone logged in can fetch problems
router.get("/", authenticate, problemController.getAllProblems);
router.get("/:id", authenticate, validateObjectId, problemController.getProblemById);

// ✅ Admin-only routes
router.post("/", authenticate, requireAdmin, problemController.createProblem);
router.put("/:id", authenticate, requireAdmin, validateObjectId, problemController.updateProblem);
router.delete("/:id", authenticate, requireAdmin, validateObjectId, problemController.deleteProblem);
router.put("/:id/restore", authenticate, requireAdmin, validateObjectId, problemController.restoreProblem);

module.exports = router;
