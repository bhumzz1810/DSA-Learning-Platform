const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  saveNote,
  getNote,
  deleteNote,
} = require("../controllers/noteController");

// Input validation middleware (optional but recommended)
function validateProblemId(req, res, next) {
  const { problemId } = req.params;
  if (!problemId || !problemId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "Invalid problem ID" });
  }
  next();
}

router.get("/:problemId", authenticate, validateProblemId, getNote);
router.post("/:problemId", authenticate, validateProblemId, saveNote);
router.delete("/:problemId", authenticate, validateProblemId, deleteNote);

module.exports = router;
