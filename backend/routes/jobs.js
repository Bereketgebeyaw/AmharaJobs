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
const { getActiveJobs, getJobById } = require('../utils/jobExpiration');

// Get all active jobs (public access) - now with automatic expiration
router.get('/', async (req, res) => {
  try {
    const { search, location, job_type, experience_level, limit = 50, offset = 0 } = req.query;
    
    const filters = {
      search,
      location,
      job_type,
      experience_level,
      limit,
      offset
    };
    
    const jobs = await getActiveJobs(filters);
    
    res.json({ jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

// Get a specific job by ID (public access) - now with automatic expiration
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const jobDetails = await getJobById(id);
    
    if (!jobDetails) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ job: jobDetails });
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ error: 'Failed to load job' });
  }
});

module.exports = router; 