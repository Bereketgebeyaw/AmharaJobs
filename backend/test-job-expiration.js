const knex = require('knex')(require('./knexfile').development);
const { expireJobs } = require('./utils/jobExpiration');

async function testJobExpiration() {
  try {
    console.log('🧪 Testing Job Expiration...\n');
    
    // First, let's see what jobs we have
    const allJobs = await knex('jobs').select('id', 'title', 'status', 'application_deadline');
    console.log('📋 Current Jobs:');
    allJobs.forEach(job => {
      console.log(`  - ${job.title} (${job.status}) - Deadline: ${job.application_deadline}`);
    });
    
    console.log('\n🔄 Running job expiration...');
    const expiredCount = await expireJobs();
    console.log(`✅ Expired ${expiredCount} jobs\n`);
    
    // Check jobs after expiration
    const jobsAfterExpiration = await knex('jobs').select('id', 'title', 'status', 'application_deadline');
    console.log('📋 Jobs After Expiration:');
    jobsAfterExpiration.forEach(job => {
      console.log(`  - ${job.title} (${job.status}) - Deadline: ${job.application_deadline}`);
    });
    
    console.log('\n✅ Job expiration test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testJobExpiration(); 