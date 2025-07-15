const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  saveNote,
  getNote,
  deleteNote,
} = require("../controllers/noteController");

router.get("/:problemId", authenticate, getNote);
router.post("/:problemId", authenticate, saveNote);
router.delete("/:problemId", authenticate, deleteNote);

module.exports = router;
