const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware to verify employer role
const verifyEmployer = async (req, res, next) => {
  try {
    const user = await knex('users').where({ id: req.user.id }).first();
    if (!user || user.user_type !== 'employer') {
      return res.status(403).json({ error: 'Employer access required' });
    }
    req.employerUser = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get employer dashboard data
router.get('/dashboard', authenticateToken, verifyEmployer, async (req, res) => {
  try {
    const employer = await knex('employers')
      .where({ user_id: req.user.id })
      .first();
    
    if (!employer) {
      return res.status(404).json({ error: 'Employer profile not found' });
    }

    // Get job statistics
    const totalJobs = await knex('jobs').where({ employer_id: employer.id }).count('* as count').first();
    const activeJobs = await knex('jobs').where({ employer_id: employer.id, is_active: true }).count('* as count').first();
    const totalApplications = await knex('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .where('jobs.employer_id', employer.id)
      .count('* as count').first();
    const pendingApplications = await knex('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .where('jobs.employer_id', employer.id)
      .where('applications.status', 'pending')
      .count('* as count').first();

    // Get recent jobs
    const recentJobs = await knex('jobs')
      .where({ employer_id: employer.id })
      .orderBy('created_at', 'desc')
      .limit(5);

    // Get recent applications
    const recentApplications = await knex('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .join('users', 'applications.jobseeker_id', 'users.id')
      .where('jobs.employer_id', employer.id)
      .select('applications.*', 'jobs.title as job_title', 'users.fullname as applicant_name', 'users.email as applicant_email')
      .orderBy('applications.applied_at', 'desc')
      .limit(5);

    res.json({
      employer: {
        ...employer,
        company_name: req.employerUser.fullname,
        email: req.employerUser.email,
        phone: req.employerUser.phone
      },
      stats: {
        totalJobs: totalJobs.count,
        activeJobs: activeJobs.count,
        totalApplications: totalApplications.count,
        pendingApplications: pendingApplications.count
      },
      recentJobs,
      recentApplications
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Get all jobs for employer
router.get('/jobs', authenticateToken, verifyEmployer, async (req, res) => {
  try {
    const employer = await knex('employers').where({ user_id: req.user.id }).first();
    const jobs = await knex('jobs')
      .where({ employer_id: employer.id })
      .orderBy('created_at', 'desc');
    
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

// Create a new job posting
router.post('/jobs', authenticateToken, verifyEmployer, async (req, res) => {
  const { title, description, requirements, location, job_type, experience_level, salary_range, benefits, application_deadline } = req.body;
  
  if (!title || !description || !requirements || !location || !job_type || !experience_level) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const employer = await knex('employers').where({ user_id: req.user.id }).first();
    
    const [job] = await knex('jobs').insert({
      employer_id: employer.id,
      title,
      description,
      requirements,
      location,
      job_type,
      experience_level,
      salary_range,
      benefits,
      application_deadline: application_deadline ? new Date(application_deadline) : null
    }).returning('*');
    
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

// Update a job posting
router.put('/jobs/:id', authenticateToken, verifyEmployer, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  try {
    const employer = await knex('employers').where({ user_id: req.user.id }).first();
    
    const job = await knex('jobs')
      .where({ id, employer_id: employer.id })
      .first();
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const [updatedJob] = await knex('jobs')
      .where({ id })
      .update({
        ...updateData,
        updated_at: new Date()
      })
      .returning('*');
    
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job posting' });
  }
});

// Delete a job posting
router.delete('/jobs/:id', authenticateToken, verifyEmployer, async (req, res) => {
  const { id } = req.params;
  
  try {
    const employer = await knex('employers').where({ user_id: req.user.id }).first();
    
    const deleted = await knex('jobs')
      .where({ id, employer_id: employer.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job posting' });
  }
});

// Get applications for a specific job
router.get('/jobs/:id/applications', authenticateToken, verifyEmployer, async (req, res) => {
  const { id } = req.params;
  
  try {
    const employer = await knex('employers').where({ user_id: req.user.id }).first();
    
    // Verify the job belongs to this employer
    const job = await knex('jobs').where({ id, employer_id: employer.id }).first();
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const applications = await knex('applications')
      .join('users', 'applications.jobseeker_id', 'users.id')
      .where('applications.job_id', id)
      .select('applications.*', 'users.fullname as applicant_name', 'users.email as applicant_email', 'users.phone as applicant_phone')
      .orderBy('applications.applied_at', 'desc');
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Update application status
router.put('/applications/:id/status', authenticateToken, verifyEmployer, async (req, res) => {
  const { id } = req.params;
  const { status, employer_notes } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  try {
    const employer = await knex('employers').where({ user_id: req.user.id }).first();
    
    // Verify the application belongs to a job posted by this employer
    const application = await knex('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .where('applications.id', id)
      .where('jobs.employer_id', employer.id)
      .first();
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const [updatedApplication] = await knex('applications')
      .where({ id })
      .update({
        status,
        employer_notes,
        updated_at: new Date()
      })
      .returning('*');
    
    res.json(updatedApplication);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Get all applications for employer
router.get('/applications', authenticateToken, verifyEmployer, async (req, res) => {
  try {
    const employer = await knex('employers').where({ user_id: req.user.id }).first();
    
    const applications = await knex('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .join('users', 'applications.jobseeker_id', 'users.id')
      .where('jobs.employer_id', employer.id)
      .select('applications.*', 'jobs.title as job_title', 'users.fullname as applicant_name', 'users.email as applicant_email', 'users.phone as applicant_phone')
      .orderBy('applications.applied_at', 'desc');
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

module.exports = router; 