// utils/mailer.js (CommonJS)
const hasNativeFetch = typeof fetch === "function";
const _fetch = hasNativeFetch
  ? fetch
  : (...a) => import("node-fetch").then(({ default: f }) => f(...a));

async function sendMail({ to, subject, text, html, replyTo }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  const from = process.env.FROM_EMAIL || "onboarding@resend.dev"; // works without DNS
  const body = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
    ...(replyTo ? { reply_to: replyTo } : {}),
  };

  const resp = await _fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Resend error ${resp.status}: ${errText}`);
  }
  return resp.json();
}

module.exports = { sendMail };
