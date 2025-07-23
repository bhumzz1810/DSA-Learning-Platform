const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");
const { authenticate, requireAdmin } = require("../middleware/auth");

// ✅ Anyone logged in can fetch
router.get("/", problemController.getAllProblems);
router.get("/:id", problemController.getProblemById);

// ✅ All routes need login
router.use(authenticate);

// ✅ Admin-only routes
router.post("/", requireAdmin, problemController.createProblem);
router.put("/:id", requireAdmin, problemController.updateProblem);
router.delete("/:id", requireAdmin, problemController.deleteProblem);
router.put("/:id/restore", requireAdmin, problemController.restoreProblem);

module.exports = router;
