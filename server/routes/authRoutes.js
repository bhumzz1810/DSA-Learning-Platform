const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgot,
  reset,
} = require("../controllers/authController");

// Basic middleware for input validation (expand as needed)
function validateRegister(req, res, next) {
  const { username, email, password } = req.body;
  if (
    typeof username !== "string" ||
    username.trim().length < 3 ||
    typeof email !== "string" ||
    !email.includes("@") ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    return res.status(400).json({ error: "Invalid registration data" });
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (
    typeof email !== "string" ||
    !email.includes("@") ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    return res.status(400).json({ error: "Invalid login data" });
  }
  next();
}

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/forgot", forgot);
router.post("/reset", reset);

module.exports = router;
