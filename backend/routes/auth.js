// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config();
} else {
  // Default to development (load .env.local)
  require('dotenv').config({ path: '.env.local' });
}

const express = require('express');
const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(require('../knexfile')[environment]);
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
  try {
    // Use environment-specific base URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://amharajobs.onrender.com' 
      : 'http://localhost:5000';
    const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;
    
    console.log('Sending verification email to:', email);
    console.log('Verification URL:', verifyUrl);
    console.log('Email user:', process.env.EMAIL_USER);
    
    await transporter.sendMail({
      from: `AmharaJobs <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your AmharaJobs account',
      html: `<p>Thank you for registering at AmharaJobs.</p>
             <p>Please <a href="${verifyUrl}">click here to verify your account</a> or copy and paste this link in your browser:</p>
             <p>${verifyUrl}</p>`
    });
    
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
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
    
    try {
      await sendVerificationEmail(email, verification_token);
      res.status(201).json({ user, message: 'Registration successful. Please check your email to verify your account.' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Still create the user but mark as unverified
      res.status(201).json({ 
        user, 
        message: 'Registration successful. Email verification failed - please contact support.' 
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Email verification endpoint
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  console.log('Verification attempt with token:', token ? token.substring(0, 10) + '...' : 'no token');
  
  if (!token) return res.status(400).send('Invalid verification link.');
  
  try {
    const user = await knex('users').where({ verification_token: token }).first();
    console.log('User found:', user ? `User ID: ${user.id}, Email: ${user.email}` : 'No user found');
    
    if (!user) return res.status(400).send('Invalid or expired verification token.');
    
    await knex('users').where({ id: user.id }).update({ is_verified: true, verification_token: null });
    console.log('User verified successfully:', user.email);
    
    // Use environment-specific frontend URL
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://amharajobs.vercel.app/login'
      : 'http://localhost:5173/login';
    
    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=${frontendUrl}" />
        </head>
        <body style="font-family:sans-serif;text-align:center;padding-top:40px;">
          <h2>Your account has been verified!</h2>
          <p>You will be redirected to the login page shortly.</p>
          <p>If not redirected automatically, <a href="${frontendUrl}">click here</a>.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Verification error:', err);
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
    const [employer] = await knex('employers').insert({
      user_id: user.id,
      company_type,
      contact_person,
      address,
      created_at: new Date()
    }).returning('*');

    // Assign default package (New User Plan) to employer
    const newUserPackage = await knex('packages').where({ name: 'New User Plan' }).first();
    if (newUserPackage) {
      await knex('employer_packages').insert({
        employer_id: employer.id,
        package_id: newUserPackage.id,
        start_date: new Date(),
        is_active: true
      });
    }
    try {
      await sendVerificationEmail(email, verification_token);
      res.status(201).json({ user, message: 'Registration successful. Please check your email to verify your account.' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Still create the user but mark as unverified
      res.status(201).json({ 
        user, 
        message: 'Registration successful. Email verification failed - please contact support.' 
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

module.exports = router; 