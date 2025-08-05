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
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = parseInt(userId);
  next();
};

// Submit a job application
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { job_id, resume_document_id, cover_letter_document_id, application_notes } = req.body;
    const userId = req.userId;

    // Check if job exists and is active
    const job = await knex('jobs')
      .where('id', job_id)
      .where('status', 'active')
      .first();

    if (!job) {
      return res.status(404).json({ error: 'Job not found or not active' });
    }

    // Check if user already applied to this job
    const existingApplication = await knex('applications')
      .where('jobseeker_id', userId)
      .where('job_id', job_id)
      .first();

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    // Verify documents belong to user
    if (resume_document_id) {
      const resume = await knex('user_documents')
        .where('id', resume_document_id)
        .where('user_id', userId)
        .first();
      
      if (!resume) {
        return res.status(400).json({ error: 'Resume not found' });
      }
    }

    if (cover_letter_document_id) {
      const coverLetter = await knex('user_documents')
        .where('id', cover_letter_document_id)
        .where('user_id', userId)
        .first();
      
      if (!coverLetter) {
        return res.status(400).json({ error: 'Cover letter not found' });
      }
    }

    // Create application
    const [application] = await knex('applications').insert({
      jobseeker_id: userId,
      job_id: job_id,
      resume_document_id: resume_document_id || null,
      cover_letter_document_id: cover_letter_document_id || null,
      application_notes: application_notes || null,
      status: 'pending'
    }).returning('*');

    res.status(201).json({ 
      message: 'Application submitted successfully',
      application 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get user's applications
router.get('/my-applications', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await knex('applications')
      .select(
        'applications.*',
        'jobs.title as job_title',
        'jobs.location as job_location',
        'jobs.job_type',
        'jobs.salary_range',
        'employers.company_type',
        'resume_doc.title as resume_title',
        'cover_letter_doc.title as cover_letter_title'
      )
      .join('jobs', 'applications.job_id', 'jobs.id')
      .join('employers', 'jobs.employer_id', 'employers.id')
      .leftJoin('user_documents as resume_doc', 'applications.resume_document_id', 'resume_doc.id')
      .leftJoin('user_documents as cover_letter_doc', 'applications.cover_letter_document_id', 'cover_letter_doc.id')
      .where('applications.jobseeker_id', userId)
      .orderBy('applications.applied_at', 'desc');

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get applications for a specific job (for employers)
router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.headers['employer-id']; // For employer authentication

    // Verify the job belongs to the employer
    const job = await knex('jobs')
      .where('id', jobId)
      .where('employer_id', employerId)
      .first();

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const applications = await knex('applications')
      .select(
        'applications.*',
        'users.fullname',
        'users.email',
        'users.phone',
        'resume_doc.title as resume_title',
        'resume_doc.file_path as resume_path',
        'cover_letter_doc.title as cover_letter_title',
        'cover_letter_doc.file_path as cover_letter_path'
      )
      .join('users', 'applications.jobseeker_id', 'users.id')
      .leftJoin('user_documents as resume_doc', 'applications.resume_document_id', 'resume_doc.id')
      .leftJoin('user_documents as cover_letter_doc', 'applications.cover_letter_document_id', 'cover_letter_doc.id')
      .where('applications.job_id', jobId)
      .orderBy('applications.applied_at', 'desc');

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status (for employers)
router.put('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const employerId = req.headers['employer-id'];

    // Verify the application belongs to a job owned by the employer
    const application = await knex('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .where('applications.id', applicationId)
      .where('jobs.employer_id', employerId)
      .first();

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await knex('applications')
      .where('id', applicationId)
      .update({ status });

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

module.exports = router; 