// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.local' });
} else {
  require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(require('../knexfile')[environment]);

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  // This should be replaced with your actual authentication middleware
  const userId = req.headers['user-id']; // For now, using header
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = parseInt(userId);
  next();
};

// Get user profile
router.get('/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own profile
    if (parseInt(userId) !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // First try to get from user_profiles table
    let profile = await knex('user_profiles')
      .where('user_id', userId)
      .first();

    if (!profile) {
      // If no profile exists, get basic info from users table
      const user = await knex('users')
        .where('id', userId)
        .select('id', 'fullname', 'email', 'phone')
        .first();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      profile = {
        user_id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: '',
        date_of_birth: '',
        gender: '',
        skills: '',
        experience: '',
        education: '',
        bio: '',
        linkedin_url: '',
        website_url: ''
      };
    }

    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is updating their own profile
    if (parseInt(userId) !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      fullname,
      email,
      phone,
      address,
      date_of_birth,
      gender,
      skills,
      experience,
      education,
      bio,
      linkedin_url,
      website_url
    } = req.body;

    // Check if profile exists
    const existingProfile = await knex('user_profiles')
      .where('user_id', userId)
      .first();

    // Sanitize date_of_birth
    const sanitizedDateOfBirth = date_of_birth === '' ? null : date_of_birth;

    if (existingProfile) {
      // Update existing profile
      await knex('user_profiles')
        .where('user_id', userId)
        .update({
          fullname,
          email,
          phone,
          address,
          date_of_birth: sanitizedDateOfBirth,
          gender,
          skills,
          experience,
          education,
          bio,
          linkedin_url,
          website_url,
          updated_at: knex.fn.now()
        });
    } else {
      // Create new profile
      await knex('user_profiles').insert({
        user_id: userId,
        fullname,
        email,
        phone,
        address,
        date_of_birth: sanitizedDateOfBirth,
        gender,
        skills,
        experience,
        education,
        bio,
        linkedin_url,
        website_url
      });
    }

    // Also update the main users table for basic info
    await knex('users')
      .where('id', userId)
      .update({
        fullname,
        email,
        phone
      });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router; 