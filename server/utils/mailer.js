const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

function render(templateName, vars = {}) {
  const file = path.join(__dirname, "..", "emails", `${templateName}.hbs`);
  const source = fs.readFileSync(file, "utf8");
  const tpl = handlebars.compile(source);
  return tpl({ appName: process.env.APP_NAME || "App", ...vars });
}

async function sendTemplate(to, subject, templateName, vars = {}) {
  const html = render(templateName, vars);
  return transporter.sendMail({
    from: `${process.env.APP_NAME || "App"} <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
}

module.exports = { sendTemplate };
