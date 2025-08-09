// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config();
} else {
  // Default to development (load .env.local)
  require('dotenv').config({ path: '.env.local' });
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  return transporter.sendMail({
    from: `AmharaJobs <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

module.exports = { transporter, sendEmail }; 