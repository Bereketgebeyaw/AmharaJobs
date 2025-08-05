// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.local' });
} else {
  require('dotenv').config();
}

const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(require('../knexfile')[environment]);

/**
 * Check and expire jobs that have passed their deadline
 * This function should be called before fetching jobs to ensure expired jobs are marked as inactive
 */
async function expireJobs() {
  try {
    const now = new Date();
    
    // Find all active jobs with deadlines that have passed
    const expiredJobs = await knex('jobs')
      .where('status', 'active')
      .where('application_deadline', '<', now)
      .whereNotNull('application_deadline');
    
    if (expiredJobs.length > 0) {
      // Update expired jobs to inactive status
      await knex('jobs')
        .whereIn('id', expiredJobs.map(job => job.id))
        .update({ 
          status: 'inactive',
          updated_at: now
        });
      
      console.log(`Expired ${expiredJobs.length} jobs:`, expiredJobs.map(job => job.title));
    }
    
    return expiredJobs.length;
  } catch (error) {
    console.error('Error expiring jobs:', error);
    throw error;
  }
}

/**
 * Get all active jobs with automatic expiration check
 */
async function getActiveJobs(filters = {}) {
  // First, expire any jobs that have passed their deadline
  await expireJobs();
  
  // Then fetch active jobs
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
  if (filters.search) {
    query = query.where(function() {
      this.where('jobs.title', 'ilike', `%${filters.search}%`)
        .orWhere('jobs.description', 'ilike', `%${filters.search}%`)
        .orWhere('users.fullname', 'ilike', `%${filters.search}%`);
    });
  }
  
  if (filters.location) {
    query = query.where('jobs.location', 'ilike', `%${filters.location}%`);
  }
  
  if (filters.job_type) {
    query = query.where('jobs.job_type', filters.job_type);
  }
  
  if (filters.experience_level) {
    query = query.where('jobs.experience_level', filters.experience_level);
  }
  
  // Apply pagination
  query = query.orderBy('jobs.created_at', 'desc');
  
  if (filters.limit) {
    query = query.limit(parseInt(filters.limit));
  }
  
  if (filters.offset) {
    query = query.offset(parseInt(filters.offset));
  }
  
  return await query;
}

/**
 * Get a specific job with expiration check
 */
async function getJobById(id) {
  // First, expire any jobs that have passed their deadline
  await expireJobs();
  
  const job = await knex('jobs')
    .where('jobs.id', id)
    .first();
    
  if (!job) {
    return null;
  }
  
  const employer = await knex('employers').where('id', job.employer_id).first();
  if (!employer) {
    return null;
  }
  
  const user = await knex('users').where('id', employer.user_id).first();
  if (!user) {
    return null;
  }
  
  return {
    ...job,
    company_name: user.fullname,
    company_email: user.email,
    contact_person: employer.contact_person,
    address: employer.address,
    phone: employer.phone
  };
}

module.exports = {
  expireJobs,
  getActiveJobs,
  getJobById
}; 