// routes/problemRoutes.js
const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");
const { authenticate, requireAdmin } = require("../middleware/auth");
router.use(authenticate); // all routes need login

// Admin CRUD routes
router.post("/", problemController.createProblem);
router.get("/", problemController.getAllProblems);
router.get("/:id", problemController.getProblemById);
router.put("/:id", problemController.updateProblem);
router.delete("/:id", problemController.deleteProblem);
router.put("/:id/restore", requireAdmin, problemController.restoreProblem);

module.exports = router;
