const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
} = require("../controllers/bookmarkController");

router.post("/:problemId", authenticate, addBookmark);
router.delete("/:problemId", authenticate, removeBookmark);
router.get("/", authenticate, getBookmarks);

module.exports = router;
