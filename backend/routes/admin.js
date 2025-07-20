const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/mailer');

// Middleware to verify admin token
const authenticateAdminToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await knex('users').where('id', decoded.id).first();
    
    if (!user || user.user_type !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const adminUser = await knex('admin_users').where('user_id', user.id).first();
    if (!adminUser || !adminUser.is_active) {
      return res.status(403).json({ error: 'Admin account inactive' });
    }

    req.user = user;
    req.adminUser = adminUser;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await knex('users').where({ email }).first();
    if (!user || user.user_type !== 'admin') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const adminUser = await knex('admin_users').where('user_id', user.id).first();
    if (!adminUser || !adminUser.is_active) {
      return res.status(403).json({ error: 'Admin account inactive' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: 'admin' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        user_type: user.user_type,
        admin_level: adminUser.admin_level
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Dashboard Data
router.get('/dashboard', authenticateAdminToken, async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await knex('users').count('* as count').first();
    const totalJobSeekers = await knex('users').where('user_type', 'jobseeker').count('* as count').first();
    const totalEmployers = await knex('users').where('user_type', 'employer').count('* as count').first();
    const totalJobs = await knex('jobs').count('* as count').first();
    const activeJobs = await knex('jobs').where('status', 'active').count('* as count').first();
    const totalApplications = await knex('applications').count('* as count').first();
    const pendingApplications = await knex('applications').where('status', 'pending').count('* as count').first();

    // Get recent activities
    const recentUsers = await knex('users')
      .orderBy('created_at', 'desc')
      .limit(10)
      .select('id', 'fullname', 'email', 'user_type', 'created_at');

    const recentJobs = await knex('jobs')
      .join('employers', 'jobs.employer_id', 'employers.id')
      .join('users', 'employers.user_id', 'users.id')
      .orderBy('jobs.created_at', 'desc')
      .limit(10)
      .select('jobs.*', 'users.fullname as employer_name');

    const recentApplications = await knex('applications')
      .join('users', 'applications.jobseeker_id', 'users.id')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .orderBy('applications.applied_at', 'desc')
      .limit(10)
      .select('applications.*', 'users.fullname as applicant_name', 'jobs.title as job_title');

    // Monthly statistics for charts
    const monthlyStats = await knex.raw(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count,
        'users' as type
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      UNION ALL
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count,
        'jobs' as type
      FROM jobs 
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `);

    res.json({
      stats: {
        totalUsers: totalUsers.count,
        totalJobSeekers: totalJobSeekers.count,
        totalEmployers: totalEmployers.count,
        totalJobs: totalJobs.count,
        activeJobs: activeJobs.count,
        totalApplications: totalApplications.count,
        pendingApplications: pendingApplications.count
      },
      recentUsers,
      recentJobs,
      recentApplications,
      monthlyStats: monthlyStats.rows
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Get all users with pagination and filters
router.get('/users', authenticateAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', user_type = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = knex('users').select('*');

    if (search) {
      query = query.where(function() {
        this.where('fullname', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`);
      });
    }

    if (user_type) {
      query = query.where('user_type', user_type);
    }

    if (status === 'verified') {
      query = query.where('is_verified', true);
    } else if (status === 'unverified') {
      query = query.where('is_verified', false);
    }

    const total = await query.clone().clearSelect().count('* as count').first();
    const users = await query.orderBy('created_at', 'desc').limit(limit).offset(offset);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total.count / limit),
        totalItems: total.count
      }
    });
  } catch (err) {
    console.error('Error in /admin/users:', err); // Added error logging
    res.status(500).json({ error: 'Failed to load users' });
  }
});

// Update user status (activate/deactivate)
router.patch('/users/:id/status', authenticateAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified, is_active } = req.body;

    const user = await knex('users').where('id', id).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {};
    if (is_verified !== undefined) updateData.is_verified = is_verified;
    if (is_active !== undefined) updateData.is_active = is_active;

    await knex('users').where('id', id).update(updateData);

    res.json({ message: 'User status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Delete user
router.delete('/users/:id', authenticateAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await knex('users').where('id', id).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await knex('users').where('id', id).del();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all jobs with pagination and filters
router.get('/jobs', authenticateAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '', employer = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = knex('jobs')
      .join('employers', 'jobs.employer_id', 'employers.id')
      .join('users', 'employers.user_id', 'users.id')
      .select('jobs.*', 'users.fullname as employer_name', 'users.email as employer_email');

    if (search) {
      query = query.where(function() {
        this.where('jobs.title', 'ilike', `%${search}%`)
          .orWhere('jobs.description', 'ilike', `%${search}%`)
          .orWhere('users.fullname', 'ilike', `%${search}%`);
      });
    }

    if (status) {
      query = query.where('jobs.status', status);
    }

    if (employer) {
      query = query.where('users.fullname', 'ilike', `%${employer}%`);
    }

    const total = await query.clone().clearSelect().count('* as count').first();
    const jobs = await query.orderBy('jobs.created_at', 'desc').limit(limit).offset(offset);

    res.json({
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total.count / limit),
        totalItems: total.count
      }
    });
  } catch (err) {
    console.error('Error in /admin/jobs:', err); // Added error logging
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

// Update job status
router.patch('/jobs/:id/status', authenticateAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, denial_reason } = req.body;

    const job = await knex('jobs').where('id', id).first();
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Only send emails if approving a pending job
    const wasPending = job.status === 'pending';
    await knex('jobs').where('id', id).update({ status });

    if (wasPending && status === 'active') {
      // Get employer info
      const employer = await knex('employers').where('id', job.employer_id).first();
      const employerUser = await knex('users').where('id', employer.user_id).first();
      // Send email to employer
      await sendEmail({
        to: employerUser.email,
        subject: 'Your job has been approved!',
        html: `<h2>Your job posting "${job.title}" has been approved and is now live on AmharaJobs.</h2><p>Thank you for using our platform!</p>`
      });
      // Send email to all jobseekers
      const jobSeekers = await knex('users').where({ user_type: 'jobseeker', is_verified: true });
      const jobUrl = `http://localhost:5173/job/${job.id}`;
      const subject = `New Job Posted: ${job.title} (${job.location})`;
      const html = `
        <h2>New Job Opportunity: ${job.title}</h2>
        <p><strong>Company:</strong> ${employer.company_name || 'A top employer'}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Type:</strong> ${job.job_type} | <strong>Experience:</strong> ${job.experience_level}</p>
        <p><strong>Description:</strong> ${job.description.substring(0, 200)}...</p>
        <p><a href="${jobUrl}" style="background:#4caf50;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">View & Apply</a></p>
        <p style="color:#888;font-size:0.9em;">You are receiving this because you have an account on AmharaJobs.</p>
      `;
      for (const seeker of jobSeekers) {
        await sendEmail({
          to: seeker.email,
          subject,
          html
        });
      }
    } else if (wasPending && status === 'inactive' && denial_reason) {
      // Send denial email to employer
      const employer = await knex('employers').where('id', job.employer_id).first();
      const employerUser = await knex('users').where('id', employer.user_id).first();
      await sendEmail({
        to: employerUser.email,
        subject: 'Your job posting was denied',
        html: `<h2>Your job posting "${job.title}" was denied by the admin.</h2><p>Reason: ${denial_reason}</p><p>If you have questions, please contact support.</p>`
      });
    }

    res.json({ message: 'Job status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

// Delete job
router.delete('/jobs/:id', authenticateAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const job = await knex('jobs').where('id', id).first();
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await knex('jobs').where('id', id).del();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Get applications with pagination and filters
router.get('/applications', authenticateAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', job = '', applicant = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = knex('applications')
      .join('users', 'applications.jobseeker_id', 'users.id')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .join('employers', 'jobs.employer_id', 'employers.id')
      .join('users as employer_users', 'employers.user_id', 'employer_users.id')
      .select(
        'applications.*',
        'users.fullname as applicant_name',
        'users.email as applicant_email',
        'jobs.title as job_title',
        'employer_users.fullname as employer_name'
      );

    if (status) {
      query = query.where('applications.status', status);
    }

    if (job) {
      query = query.where('jobs.title', 'ilike', `%${job}%`);
    }

    if (applicant) {
      query = query.where('users.fullname', 'ilike', `%${applicant}%`);
    }

    const total = await query.clone().clearSelect().count('* as count').first();
    const applications = await query.orderBy('applications.applied_at', 'desc').limit(limit).offset(offset);

    res.json({
      applications,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total.count / limit),
        totalItems: total.count
      }
    });
  } catch (err) {
    console.error('Error in /admin/applications:', err); // Added error logging
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Generate reports
router.get('/reports', authenticateAdminToken, async (req, res) => {
  try {
    const { type = 'monthly', start_date, end_date } = req.query;

    let startDate = start_date ? new Date(start_date) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = end_date ? new Date(end_date) : new Date();

    let reportData = {};

    if (type === 'monthly' || type === 'all') {
      // User registration trends
      const userRegistrations = await knex.raw(`
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as count,
          user_type
        FROM users 
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY DATE_TRUNC('day', created_at), user_type
        ORDER BY date
      `, [startDate, endDate]);

      // Job posting trends
      const jobPostings = await knex.raw(`
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as count,
          status
        FROM jobs 
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY DATE_TRUNC('day', created_at), status
        ORDER BY date
      `, [startDate, endDate]);

      // Application trends
      const applications = await knex.raw(`
        SELECT 
          DATE_TRUNC('day', applied_at) as date,
          COUNT(*) as count,
          status
        FROM applications 
        WHERE applied_at >= ? AND applied_at <= ?
        GROUP BY DATE_TRUNC('day', applied_at), status
        ORDER BY date
      `, [startDate, endDate]);

      reportData = {
        userRegistrations: userRegistrations.rows,
        jobPostings: jobPostings.rows,
        applications: applications.rows
      };
    }

    res.json(reportData);
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router; 