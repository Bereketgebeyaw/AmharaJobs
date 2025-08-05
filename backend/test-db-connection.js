// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.local' });
} else {
  require('dotenv').config();
}

const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    // Show connection info (without password)
    if (process.env.DATABASE_URL) {
      console.log('Using DATABASE_URL connection string');
      const url = new URL(process.env.DATABASE_URL);
      console.log('Host:', url.hostname);
      console.log('Port:', url.port);
      console.log('Database:', url.pathname.slice(1));
      console.log('User:', url.username);
    } else {
      console.log('Using individual database parameters');
      console.log('Host:', process.env.DB_HOST);
      console.log('Port:', process.env.DB_PORT);
      console.log('Database:', process.env.DB_NAME);
      console.log('User:', process.env.DB_USER);
    }
    
    // Test connection
    const result = await knex.raw('SELECT NOW() as current_time, version() as db_version');
    console.log('\n✅ Database connection successful!');
    console.log('Current time from DB:', result.rows[0].current_time);
    console.log('Database version:', result.rows[0].db_version.split(' ')[0]);
    
    // Test if tables exist
    const tables = await knex.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available tables:');
    if (tables.rows.length === 0) {
      console.log('  No tables found. You may need to run migrations.');
      console.log('  Run: npm run migrate');
    } else {
      tables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Possible solutions:');
      console.error('1. Check if your database is running');
      console.error('2. Verify your DATABASE_URL or individual connection parameters');
      console.error('3. Make sure your .env file is in the backend directory');
    }
    
    if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check your username and password.');
    }
    
    if (error.code === '3D000') {
      console.error('\n💡 Database does not exist. Create the database first.');
    }
    
  } finally {
    await knex.destroy();
  }
}

testConnection(); 