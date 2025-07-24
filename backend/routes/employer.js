const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/mailer');

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
    const activeJobs = await knex('jobs').where({ employer_id: employer.id, status: 'active' }).count('* as count').first();
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
    
    res.json({ jobs });
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
      status: 'pending',
      application_deadline: application_deadline ? new Date(application_deadline) : null
    }).returning('*');

    res.status(201).json({
      ...job,
      message: 'Job submitted and pending admin approval.'
    });
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

// Update job status
router.patch('/jobs/:id/status', authenticateToken, verifyEmployer, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
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
        status,
        updated_at: new Date()
      })
      .returning('*');
    
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job status' });
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
router.patch('/applications/:id/status', authenticateToken, verifyEmployer, async (req, res) => {
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
    const { job_id } = req.query;
    
    let query = knex('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .join('users', 'applications.jobseeker_id', 'users.id')
      .leftJoin('user_documents as resume_doc', 'applications.resume_document_id', 'resume_doc.id')
      .leftJoin('user_documents as cover_letter_doc', 'applications.cover_letter_document_id', 'cover_letter_doc.id')
      .where('jobs.employer_id', employer.id)
      .select(
        'applications.*',
        'jobs.title as job_title',
        'users.fullname as applicant_name',
        'users.email as applicant_email',
        'users.phone as applicant_phone',
        'resume_doc.title as resume_title',
        'resume_doc.file_path as resume_path',
        'cover_letter_doc.title as cover_letter_title',
        'cover_letter_doc.file_path as cover_letter_path'
      );
    
    if (job_id && job_id !== 'all') {
      query = query.where('applications.job_id', job_id);
    }
    
    const applications = await query.orderBy('applications.applied_at', 'desc');
    
    // Transform the data to match frontend expectations
    const transformedApplications = applications.map(app => ({
      id: app.id,
      status: app.status,
      cover_letter: app.cover_letter,
      resume_url: app.resume_url,
      created_at: app.applied_at,
      updated_at: app.updated_at,
      job: {
        id: app.job_id,
        title: app.job_title
      },
      applicant: {
        id: app.jobseeker_id,
        fullname: app.applicant_name,
        email: app.applicant_email,
        phone: app.applicant_phone
      },
      resume_document: app.resume_path ? {
        title: app.resume_title,
        file_path: app.resume_path
      } : null,
      cover_letter_document: app.cover_letter_path ? {
        title: app.cover_letter_title,
        file_path: app.cover_letter_path
      } : null
    }));
    
    res.json({ applications: transformedApplications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Public endpoint to get all packages (pricing plans)
router.get('/packages', async (req, res) => {
  try {
    const packages = await knex('packages').select('*').orderBy('price', 'asc');
    res.json({ packages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load packages' });
  }
});

// Chapa payment integration
const axios = require('axios');

// Create a payment session for Chapa
router.post('/pay', authenticateToken, verifyEmployer, async (req, res) => {
  const { package_id } = req.body;
  if (!package_id) return res.status(400).json({ error: 'Package ID is required' });

  try {
    const employer = await knex('employers').where({ user_id: req.user.id }).first();
    const pkg = await knex('packages').where({ id: package_id }).first();
    if (!pkg) return res.status(404).json({ error: 'Package not found' });

    // Prepare Chapa payment payload
    const tx_ref = `amhara_${Date.now()}_${employer.id}`;
    const chapaPayload = {
      amount: pkg.price,
      currency: 'ETB',
      email: employer.email, // replace if req.employerUser.email is undefined
      first_name: employer.company_name || 'Employer',
      last_name: employer.contact_person || 'Contact',
      tx_ref,
      callback_url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/employer/chapa-callback`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/employer/payment-success?tx_ref=${tx_ref}`,
      customization: {
        title: 'AmharaJobs Plan', // ✅ short title
        description: `Payment for ${pkg.name}`
      }
    };
    

    // Call Chapa API to create payment
    const chapaRes = await axios.post('https://api.chapa.co/v1/transaction/initialize', chapaPayload, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (chapaRes.data && chapaRes.data.status === 'success') {
      // Optionally, store tx_ref and pending payment in DB
      await knex('employer_packages').insert({
        employer_id: employer.id,
        package_id: pkg.id,
        start_date: new Date(),
        is_active: false, // Activate after payment
        tx_ref
      });
      return res.json({ checkout_url: chapaRes.data.data.checkout_url });
    } else {
      return res.status(500).json({ error: 'Failed to initialize payment' });
    }
  } catch (err) {
    console.error('Chapa payment error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Chapa webhook/callback endpoint
router.post('/chapa-callback', async (req, res) => {
  // Chapa will send tx_ref and status
  const { tx_ref, status } = req.body;
  if (!tx_ref || !status) return res.status(400).json({ error: 'Invalid callback' });

  try {
    // Find the pending employer_package by tx_ref
    const employerPackage = await knex('employer_packages').where({ tx_ref }).first();
    if (!employerPackage) return res.status(404).json({ error: 'Transaction not found' });

    if (status === 'success') {
      // Activate the package
      await knex('employer_packages').where({ id: employerPackage.id }).update({ is_active: true, end_date: null });
      // Optionally, send confirmation email
    } else {
      // Optionally, handle failed payment
      await knex('employer_packages').where({ id: employerPackage.id }).update({ is_active: false });
    }
    res.json({ message: 'Callback processed' });
  } catch (err) {
    console.error('Chapa callback error:', err.message);
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

// Verify payment status for frontend
router.post('/verify-payment', async (req, res) => {
  const { tx_ref } = req.body;
  if (!tx_ref) return res.status(400).json({ status: 'error', message: 'Missing tx_ref' });
  try {
    const employerPackage = await knex('employer_packages').where({ tx_ref }).first();
    if (!employerPackage) return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    if (employerPackage.is_active) {
      return res.json({ status: 'success', message: 'Payment verified and package activated.' });
    } else {
      return res.json({ status: 'error', message: 'Payment not completed or package not activated.' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to verify payment.' });
  }
});

module.exports = router; 