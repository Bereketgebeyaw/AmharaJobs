// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.local' });
} else {
  require('dotenv').config();
}

const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);
const bcrypt = require('bcrypt');

async function createTestUser() {
  try {
    console.log('🔧 Creating test user account...');
    
    // Check if user already exists
    const existingUser = await knex('users').where({ email: 'test@test.com' }).first();
    
    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('Email: test@test.com');
      console.log('Password: test123');
      return;
    }
    
    // Hash password
    const password_hash = await bcrypt.hash('test123', 10);
    
    // Create test user
    const [user] = await knex('users').insert({
      fullname: 'Test User',
      email: 'test@test.com',
      phone: '1234567890',
      password_hash: password_hash,
      is_verified: true, // Skip email verification for testing
      user_type: 'jobseeker'
    }).returning(['id', 'fullname', 'email', 'phone', 'created_at']);
    
    console.log('✅ Test user created successfully!');
    console.log('User details:', user);
    console.log('\n📝 Login credentials:');
    console.log('Email: test@test.com');
    console.log('Password: test123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await knex.destroy();
  }
}

createTestUser(); 