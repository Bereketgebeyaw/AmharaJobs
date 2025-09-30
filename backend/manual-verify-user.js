require('dotenv').config({ path: '.env.local' });
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

async function manualVerifyUser() {
  try {
    console.log('🔍 Checking unverified users...');
    
    const unverifiedUsers = await knex('users')
      .select('id', 'fullname', 'email', 'verification_token')
      .where('is_verified', false);
    
    if (unverifiedUsers.length === 0) {
      console.log('✅ No unverified users found');
      return;
    }
    
    console.log(`📋 Found ${unverifiedUsers.length} unverified users:`);
    unverifiedUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.fullname}, Email: ${user.email}`);
    });
    
    // Verify all unverified users
    console.log('\n🔧 Manually verifying all unverified users...');
    
    for (const user of unverifiedUsers) {
      await knex('users')
        .where('id', user.id)
        .update({ 
          is_verified: true, 
          verification_token: null 
        });
      console.log(`✅ Verified: ${user.email}`);
    }
    
    console.log('\n🎉 All users have been manually verified!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await knex.destroy();
  }
}

manualVerifyUser();
