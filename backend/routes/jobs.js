const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);

// Get all active jobs (public access)
router.get('/', async (req, res) => {
  try {
    const { search, location, job_type, experience_level, limit = 50, offset = 0 } = req.query;
    
    let query = knex('jobs')
      .join('employers', 'jobs.employer_id', 'employers.id')
      .join('users', 'employers.user_id', 'users.id')
      .where('jobs.status', 'active')
      .select(
        'jobs.*',
        'users.fullname as company_name',
        'users.email as company_email'
      );
    
    // Apply filters
    if (search) {
      query = query.where(function() {
        this.where('jobs.title', 'ilike', `%${search}%`)
          .orWhere('jobs.description', 'ilike', `%${search}%`)
          .orWhere('users.fullname', 'ilike', `%${search}%`);
      });
    }
    
    if (location) {
      query = query.where('jobs.location', 'ilike', `%${location}%`);
    }
    
    if (job_type) {
      query = query.where('jobs.job_type', job_type);
    }
    
    if (experience_level) {
      query = query.where('jobs.experience_level', experience_level);
    }
    
    // Apply pagination
    query = query.orderBy('jobs.created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    const jobs = await query;
    
    res.json({ jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

// Get a specific job by ID (public access)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await knex('jobs')
      .where('jobs.id', id)
      .first();
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const employer = await knex('employers').where('id', job.employer_id).first();
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found for this job' });
    }
    const user = await knex('users').where('id', employer.user_id).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found for this employer' });
    }
    const jobDetails = {
      ...job,
      company_name: user.fullname,
      company_email: user.email,
      contact_person: employer.contact_person,
      address: employer.address,
      phone: employer.phone
    };
    res.json({ job: jobDetails });
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ error: 'Failed to load job' });
  }
});

module.exports = router; 