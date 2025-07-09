require('dotenv').config();
const knex = require('knex')(require('./knexfile').development);

async function updateAdminUserType() {
  try {
    const email = 'admin@amharajobs.com';
    const updated = await knex('users')
      .where({ email })
      .update({ user_type: 'admin' });
    if (updated) {
      console.log('✅ Admin user_type updated to "admin" for:', email);
    } else {
      console.log('❌ No user found with email:', email);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin user_type:', error.message);
    process.exit(1);
  }
}

updateAdminUserType(); 