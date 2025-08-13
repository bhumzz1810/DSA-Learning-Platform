// routes/contact.js
const router = require("express").Router();
const { sendMail } = require("../utils/mailer");

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, message: "Invalid email" });
    if (message.trim().length < 10)
      return res.status(400).json({ ok: false, message: "Message too short" });

    // DEBUG: log that we reached send
    console.log("Contact payload OK:", {
      name,
      email,
      messageLen: message.length,
    });

    // Send to you
    const toAdmin =
      process.env.SUPPORT_EMAIL ||
      process.env.FROM_EMAIL ||
      "onboarding@resend.dev";

    await sendMail({
      to: toAdmin,
      subject: `New contact: ${name}`,
      replyTo: email,
      text: message,
      html: `<p><b>${name}</b> (${email}) wrote:</p><p>${message.replace(
        /\n/g,
        "<br/>"
      )}</p>`,
    });

    // Ack to user
    await sendMail({
      to: email,
      subject: "Thanks — we got your message",
      text: `Hi ${name},\n\nThanks for contacting us! We'll get back to you soon.\n\n— Team`,
      html: `<p>Hi ${name},</p><p>Thanks for contacting us! We'll get back to you soon.</p><p>— Team</p>`,
    });

    return res.json({
      ok: true,
      message: "Thanks! We’ll get back to you shortly.",
    });
  } catch (e) {
    console.error("Contact send failed:", e?.message || e);
    // Return distinct message so we know it's the send step
    return res.status(500).json({ ok: false, message: "Email send failed" });
  }
});

module.exports = router;
