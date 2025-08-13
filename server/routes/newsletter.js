const router = require("express").Router();
const crypto = require("crypto");
const Subscriber = require("../models/Subscriber");
const { sendMail } = require("../utils/mailer");

// tiny helpers
const isEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const newToken = () => crypto.randomBytes(24).toString("hex");
const APP_NAME = process.env.APP_NAME || "DSArena";
const CLIENT = (process.env.CLIENT_URL || "http://localhost:5173").replace(
  /\/+$/,
  ""
);

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email = "" } = req.body || {};
    if (!isEmail(email))
      return res.status(400).json({ ok: false, message: "Invalid email" });

    const existing = await Subscriber.findOne({ email });
    const confirmToken = newToken();

    if (!existing) {
      await Subscriber.create({ email, status: "pending", confirmToken });
    } else if (existing.status === "active") {
      return res.json({ ok: true, message: "You’re already subscribed." });
    } else {
      existing.status = "pending";
      existing.confirmToken = confirmToken;
      await existing.save();
    }

    const confirmUrl = `${CLIENT}/#/newsletter/confirm?token=${encodeURIComponent(
      confirmToken
    )}`;

    await sendMail({
      to: email,
      subject: `Confirm your ${APP_NAME} newsletter subscription`,
      text: `Click to confirm: ${confirmUrl}`,
      html: `<p>Thanks for subscribing to <b>${APP_NAME}</b>!</p>
             <p><a href="${confirmUrl}">Click here to confirm</a></p>
             <p>If you didn’t request this, ignore this email.</p>`,
    });

    return res.json({
      ok: true,
      message: "Check your email to confirm your subscription.",
    });
  } catch (e) {
    console.error("newsletter subscribe error:", e);
    return res.status(500).json({ ok: false, message: "Could not subscribe" });
  }
});

// GET /api/newsletter/confirm?token=...
router.get("/confirm", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token");

    const sub = await Subscriber.findOne({
      confirmToken: token,
      status: "pending",
    });
    if (!sub) return res.status(400).send("Invalid or expired link");

    sub.status = "active";
    sub.subscribedAt = new Date();
    sub.confirmToken = undefined;
    sub.unsubscribeToken = newToken();
    await sub.save();

    // land on a nice page in your SPA
    return res.redirect(`${CLIENT}/#/newsletter/confirmed`);
  } catch (e) {
    console.error("newsletter confirm error:", e);
    return res.status(500).send("Server error");
  }
});

// GET /api/newsletter/unsubscribe?token=...
router.get("/unsubscribe", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token");

    const sub = await Subscriber.findOne({
      unsubscribeToken: token,
      status: { $ne: "unsubscribed" },
    });
    if (!sub) return res.status(400).send("Invalid or expired link");

    sub.status = "unsubscribed";
    sub.unsubscribedAt = new Date();
    await sub.save();

    return res.redirect(`${CLIENT}/#/newsletter/unsubscribed`);
  } catch (e) {
    console.error("newsletter unsubscribe error:", e);
    return res.status(500).send("Server error");
  }
});

/** -------- Optional admin endpoints -------- **/

// Simple admin guard; adjust to your auth scheme
function requireAdmin(req, res, next) {
  // if you already have authenticate middleware, use it and check role:
  // if (!req.user || req.user.role !== 'admin') return res.sendStatus(403);
  // For now just block by default:
  if (process.env.ALLOW_NEWSLETTER_SEND !== "true") return res.sendStatus(403);
  next();
}

// POST /api/newsletter/send  { subject, html, text }
router.post("/send", requireAdmin, async (req, res) => {
  try {
    const { subject = "", html = "", text = "" } = req.body || {};
    if (!subject || (!html && !text))
      return res.status(400).json({ ok: false, message: "Missing content" });

    const recipients = await Subscriber.find({ status: "active" })
      .select("email unsubscribeToken")
      .lean();
    let sent = 0,
      failed = 0;

    // Send individually so recipients aren't exposed, and include unsubscribe link per user
    for (const r of recipients) {
      const unsubUrl = `${CLIENT}/api/newsletter/unsubscribe?token=${encodeURIComponent(
        r.unsubscribeToken
      )}`;
      const finalHtml = `${html}<hr/><p style="font-size:12px;color:#666">
        You’re receiving this because you subscribed to ${APP_NAME}. 
        <a href="${unsubUrl}">Unsubscribe</a>.</p>`;
      const finalText = `${text || ""}\n\nUnsubscribe: ${unsubUrl}`;

      try {
        await sendMail({
          to: r.email,
          subject,
          html: finalHtml,
          text: finalText,
        });
        sent++;
      } catch {
        failed++;
      }
    }

    return res.json({ ok: true, sent, failed, total: recipients.length });
  } catch (e) {
    console.error("newsletter send error:", e);
    return res.status(500).json({ ok: false, message: "Send failed" });
  }
});

// GET /api/newsletter/export  -> list active emails (admin)
router.get("/export", requireAdmin, async (req, res) => {
  const rows = await Subscriber.find({ status: "active" })
    .select("email -_id")
    .lean();
  res.json({ ok: true, count: rows.length, emails: rows.map((r) => r.email) });
});

module.exports = router;
