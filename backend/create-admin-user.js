require('dotenv').config();
const knex = require('knex')(require('./knexfile').development);
const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    // Admin user details
    const adminData = {
      fullname: 'Admin User',
      email: 'admin@amharajobs.com',
      phone: '+251900000000',
      password: 'admin123', // This will be hashed
      user_type: 'admin', // Now use 'admin' since the enum allows it
      is_verified: true
    };

    console.log('Creating admin user...');

    // Hash the password
    const password_hash = await bcrypt.hash(adminData.password, 10);

    // Insert the user
    const [user] = await knex('users').insert({
      fullname: adminData.fullname,
      email: adminData.email,
      phone: adminData.phone,
      password_hash: password_hash,
      user_type: adminData.user_type,
      is_verified: adminData.is_verified
    }).returning('*');

    console.log('✅ User created successfully:', user.id);

    // Insert admin user record
    const [adminUser] = await knex('admin_users').insert({
      user_id: user.id,
      admin_level: 'super_admin',
      permissions: JSON.stringify(['all']), // All permissions
      is_active: true
    }).returning('*');

    console.log('✅ Admin user record created successfully:', adminUser.id);

    console.log('\n🎉 Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('🔗 Login URL: http://localhost:5173/admin/login');
    console.log('\n⚠️  Note: User type is temporarily set to "employer" due to enum constraints.');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === '23505') {
      console.log('💡 User with this email already exists. You can use the existing credentials or create a new admin user.');
    }
    
    process.exit(1);
  }
}

// Run the script
createAdminUser(); 