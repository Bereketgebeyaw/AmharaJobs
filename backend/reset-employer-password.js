const knex = require('knex')(require('./knexfile').development);
const bcrypt = require('bcrypt');

async function resetEmployerPassword() {
  try {
    const email = 'gebeyawbereket8@gmail.com';
    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await knex('users')
      .where({ email })
      .update({ password_hash: hashedPassword });
    
    console.log(`Password reset for ${email} to: ${newPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
}

resetEmployerPassword(); 