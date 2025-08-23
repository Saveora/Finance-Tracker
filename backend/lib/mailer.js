// lib/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: 'pikudipteshsingh@gmail.com',
    pass: 'dhlrbpgbqkjieazu',
  }
});

async function sendPasswordResetEmail(to, resetUrl) {
  const html = `
    <div style="font-family: Inter, system-ui, Arial; color:#111827;">
      <h3 style="color:#111827">Password reset requested</h3>
      <p>Click the button below to reset your password. This link expires in 30 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#FBBF24;color:#111827;text-decoration:none;font-weight:700;">
        Reset password
      </a>
      <p style="color:#555">If you didn't request this, you can ignore this message.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_FROM}>`,
    to,
    subject: 'Reset your password',
    html
  });
}

module.exports = { sendPasswordResetEmail };
