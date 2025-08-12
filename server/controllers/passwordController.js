const crypto = require("crypto");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    // Always respond ok (don’t leak accounts)
    if (!user) return res.json({ ok: true });

    // Generate raw token → store only the hash
    const raw = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${raw}`;

    const html = `
      <h2>Reset your ${process.env.APP_NAME} password</h2>
      <p>This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Reset Password</a></p>
      <p>Or copy: ${resetUrl}</p>
    `;

    // don’t fail the request if email fails
    try {
      await sendEmail(user.email, "Reset your password", html);
    } catch {}

    return res.json({ ok: true });
  } catch (e) {
    console.error("Forgot password error:", e);
    return res.json({ ok: true });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password || password.length < 6) {
      return res.status(400).json({ error: "Invalid token or password" });
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired link" });

    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ ok: true });
  } catch (e) {
    console.error("Reset password error:", e);
    return res.status(500).json({ error: "Server error" });
  }
};
