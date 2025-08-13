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

    // Honeypot: if a bot fills this hidden field, drop silently
    if (website) return res.json({ ok: true });

    if (name.trim().length < 2) throw new Error("Name is too short");
    if (!isEmail(email)) throw new Error("Invalid email");
    if (message.trim().length < 10) throw new Error("Message is too short");

    // Notify you
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

    // Optional: auto-ack to the user
    await sendMail({
      to: email,
      subject: "Thanks — we got your message",
      text: `Hi ${name},\n\nThanks for contacting us! We'll get back to you soon.\n\n— Team`,
      html: `<p>Hi ${name},</p><p>Thanks for contacting us! We'll get back to you soon.</p><p>— Team</p>`,
    });

    res.json({ ok: true, message: "Thanks! We’ll get back to you shortly." });
  } catch (e) {
    console.error("contact error:", e.message);
    res.status(400).json({ ok: false, message: "Invalid input" });
  }
});

module.exports = router;
