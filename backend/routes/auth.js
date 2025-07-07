const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: send verification email
async function sendVerificationEmail(email, token) {
  const verifyUrl = `http://localhost:5000/api/auth/verify?token=${token}`;
  await transporter.sendMail({
    from: `AmharaJobs <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your AmharaJobs account',
    html: `<p>Thank you for registering at AmharaJobs.</p>
           <p>Please <a href="${verifyUrl}">click here to verify your account</a> or copy and paste this link in your browser:</p>
           <p>${verifyUrl}</p>`
  });
}

// Register jobseeker
router.post('/register', async (req, res) => {
  const { fullname, email, phone, password } = req.body;
  if (!fullname || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const existing = await knex('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const verification_token = crypto.randomBytes(32).toString('hex');
    const [user] = await knex('users')
      .insert({ fullname, email, phone, password_hash, verification_token, is_verified: false })
      .returning(['id', 'fullname', 'email', 'phone', 'created_at']);
    await sendVerificationEmail(email, verification_token);
    res.status(201).json({ user, message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Email verification endpoint
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Invalid verification link.');
  try {
    const user = await knex('users').where({ verification_token: token }).first();
    if (!user) return res.status(400).send('Invalid or expired verification token.');
    await knex('users').where({ id: user.id }).update({ is_verified: true, verification_token: null });
    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="2;url=http://localhost:5173/login" />
        </head>
        <body style="font-family:sans-serif;text-align:center;padding-top:40px;">
          <h2>Your account has been verified!</h2>
          <p>You will be redirected to the login page shortly.</p>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Verification failed.');
  }
});

// Login jobseeker
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }
  try {
    const user = await knex('users').where({ email }).first();
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
    if (!user.is_verified) return res.status(403).json({ error: 'Please verify your email before logging in.' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        fullname: user.fullname, 
        email: user.email, 
        phone: user.phone,
        user_type: user.user_type 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Employer registration
router.post('/employer/register', async (req, res) => {
  const { company_name, company_type, contact_person, address, email, phone, password } = req.body;
  if (!company_name || !company_type || !contact_person || !address || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const existing = await knex('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const verification_token = crypto.randomBytes(32).toString('hex');
    // Create user with company name as fullname
    const [user] = await knex('users')
      .insert({
        fullname: company_name,
        email,
        phone,
        password_hash,
        user_type: 'employer',
        verification_token,
        is_verified: false
      })
      .returning(['id', 'fullname', 'email', 'phone', 'created_at']);
    // Create employer record with business-specific data only
    await knex('employers').insert({
      user_id: user.id,
      company_type,
      contact_person,
      address,
      created_at: new Date()
    });
    await sendVerificationEmail(email, verification_token);
    res.status(201).json({ user, message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

module.exports = router; 