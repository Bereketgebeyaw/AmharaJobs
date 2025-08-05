require('dotenv').config();
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    
    // Test connection first
    await knex.raw('SELECT 1');
    console.log('✅ Database connection verified');
    
    // Run migrations
    console.log('\n📦 Running migrations...');
    await knex.migrate.latest();
    console.log('✅ Migrations completed');
    
    // Run seeds
    console.log('\n🌱 Running seeds...');
    await knex.seed.run();
    console.log('✅ Seeds completed');
    
    // Show final table count
    const tables = await knex.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Database setup complete!');
    console.log(`Total tables: ${tables.rows.length}`);
    console.log('\nTables created:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log('\n🎉 Your database is ready!');
    console.log('You can now start your server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Database setup failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('migration')) {
      console.error('\n💡 Migration error. Check if your database is accessible.');
    }
    
  } finally {
    await knex.destroy();
  }
}

setupDatabase(); 