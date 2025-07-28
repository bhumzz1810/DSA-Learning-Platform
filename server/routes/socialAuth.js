const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function buildRedirectUrl(user, token) {
  // Use encodeURIComponent safely for user data
  const userData = encodeURIComponent(
    JSON.stringify({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    })
  );
  // Consider moving client URL to env var for flexibility
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return `${clientUrl}/social-login?token=${token}&user=${userData}`;
}

// GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      const redirectUrl = buildRedirectUrl(req.user, token);
      res.redirect(redirectUrl);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect("/?error=authentication_failed");
    }
  }
);

// GITHUB LOGIN
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      const redirectUrl = buildRedirectUrl(req.user, token);
      res.redirect(redirectUrl);
    } catch (err) {
      console.error("GitHub callback error:", err);
      res.redirect("/?error=authentication_failed");
    }
  }
);

module.exports = router;
