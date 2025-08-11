// server/routes/socialAuth.js
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const CLIENT = process.env.CLIENT_URL || "http://localhost:5173";

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function buildRedirectUrl(user, token) {
  const userParam = encodeURIComponent(
    JSON.stringify({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    })
  );
  // query BEFORE hash; route AFTER hash (HashRouter)
  return `${CLIENT}/?token=${token}&user=${userParam}#/social-login`;
}

// GOOGLE
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT}/#/login?error=google`,
    session: true,
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      return res.redirect(buildRedirectUrl(req.user, token));
    } catch (e) {
      console.error("Google redirect error:", e);
      return res.redirect(`${CLIENT}/#/login?error=server`);
    }
  }
);

// GITHUB
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${CLIENT}/#/login?error=github`,
    session: true,
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      return res.redirect(buildRedirectUrl(req.user, token));
    } catch (e) {
      console.error("GitHub redirect error:", e);
      return res.redirect(`${CLIENT}/#/login?error=server`);
    }
  }
);

module.exports = router;
