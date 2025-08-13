// routes/contact.js
const router = require("express").Router();
const { sendMail } = require("../utils/mailer");
const ContactMessage = require("../models/ContactMessage");

const isEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

router.post("/", async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      message = "",
      website = "",
    } = req.body || {};
    if (website) return res.json({ ok: true }); // honeypot

    if (name.trim().length < 2)
      return res.status(400).json({ ok: false, message: "Name too short" });
    if (!isEmail(email))
      return res.status(400).json({ ok: false, message: "Invalid email" });
    if (message.trim().length < 10)
      return res.status(400).json({ ok: false, message: "Message too short" });

    // 1) Save initial record
    const doc = await ContactMessage.create({
      name,
      email,
      message,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      status: "received",
    });

    // 2) Send admin email
    const toAdmin =
      process.env.SUPPORT_EMAIL ||
      process.env.FROM_EMAIL ||
      "onboarding@resend.dev";
    const adminResp = await sendMail({
      to: toAdmin,
      subject: `New contact: ${name}`,
      replyTo: email,
      text: message,
      html: `<p><b>${name}</b> (${email}) wrote:</p><p>${message.replace(
        /\n/g,
        "<br/>"
      )}</p>`,
    });

    // 3) Send acknowledgment to user
    const userResp = await sendMail({
      to: email,
      subject: "Thanks — we got your message",
      text: `Hi ${name},\n\nThanks for contacting us! We'll get back to you soon.\n\n— Team`,
      html: `<p>Hi ${name},</p><p>Thanks for contacting us! We'll get back to you soon.</p><p>— Team</p>`,
    });

    // 4) Update record as sent
    await ContactMessage.findByIdAndUpdate(doc._id, {
      status: "sent",
      providerMessageId: adminResp?.id || userResp?.id, // Resend returns { id: "..." }
      $unset: { error: 1 },
    });

    return res.json({
      ok: true,
      message: "Thanks! We’ll get back to you shortly.",
    });
  } catch (e) {
    console.error("Contact send failed:", e?.message || e);

    // Best-effort update if we created a doc already
    try {
      const { name, email, message } = req.body || {};
      await ContactMessage.create({
        name,
        email,
        message,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        status: "failed",
        error: e?.message?.slice(0, 500),
      });
    } catch (_) {}

    return res.status(500).json({ ok: false, message: "Email send failed" });
  }
});

module.exports = router;
