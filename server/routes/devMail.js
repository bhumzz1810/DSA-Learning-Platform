// routes/devMail.js
const router = require("express").Router();
const { sendTemplate } = require("../utils/mailer");

router.post("/send-test", async (req, res) => {
  try {
    await sendTemplate("you@example.com", "Hello from Mailtrap", "welcome", {
      name: "Developer",
      verifyUrl: `${process.env.CLIENT_URL}/verify-email?token=fake`,
    });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to send" });
  }
});

module.exports = router;
