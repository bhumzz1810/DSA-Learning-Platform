const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = encodeURIComponent(
      JSON.stringify({
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role,
      })
    );

    res.redirect(
      `http://localhost:5173/social-login?token=${token}&user=${userData}`
    );
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
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = encodeURIComponent(
      JSON.stringify({
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role,
      })
    );

    res.redirect(
      `http://localhost:5173/social-login?token=${token}&user=${userData}`
    );
  }
);

module.exports = router;
