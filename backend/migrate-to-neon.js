const knex = require('knex');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Source database (Render)
const sourceConfig = {
  client: 'pg',
  connection: {
    host: 'dpg-d283920gjchc738s6pe0-a.oregon-postgres.render.com',
    port: 5432,
    user: 'amharajobs_db_user',
    password: 'O5SrkZtAaCZaZSSJWzX9ZQhLcJoRMwYP',
    database: 'amharajobs_db',
    ssl: { rejectUnauthorized: false }
  }
};

// Target database (Neon)
const targetConfig = {
  client: 'pg',
  connection: {
    connectionString: 'postgresql://neondb_owner:npg_MZlHd31KUVXs@ep-fancy-bird-adag0dhr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  }
};

async function migrateDatabase() {
  let sourceDb, targetDb;
  
  try {
    console.log('🚀 Starting database migration from Render to Neon...');
    
    // Connect to both databases
    console.log('📡 Connecting to source database (Render)...');
    sourceDb = knex(sourceConfig);
    await sourceDb.raw('SELECT 1');
    console.log('✅ Connected to source database');
    
    console.log('📡 Connecting to target database (Neon)...');
    targetDb = knex(targetConfig);
    await targetDb.raw('SELECT 1');
    console.log('✅ Connected to target database');
    
    // Get all tables from source
    console.log('📋 Getting table list from source database...');
    const tables = await sourceDb.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log(`Found ${tables.rows.length} tables to migrate:`);
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    // Export data from each table
    console.log('\n📤 Exporting data from source database...');
    const exportData = {};
    
    for (const table of tables.rows) {
      const tableName = table.table_name;
      console.log(`  Exporting ${tableName}...`);
      
      try {
        const data = await sourceDb(tableName).select('*');
        exportData[tableName] = data;
        console.log(`    ✅ ${data.length} rows exported`);
      } catch (error) {
        console.log(`    ⚠️  Error exporting ${tableName}: ${error.message}`);
        exportData[tableName] = [];
      }
    }
    
    // Save export to file
    console.log('\n💾 Saving export to file...');
    fs.writeFileSync('database-export.json', JSON.stringify(exportData, null, 2));
    console.log('✅ Export saved to database-export.json');
    
    // Import data to target database
    console.log('\n📥 Importing data to target database...');
    
    // First, run migrations on target database
    console.log('  Running migrations on target database...');
    await targetDb.migrate.latest();
    console.log('  ✅ Migrations completed');
    
    // Import data in correct order (respecting foreign key constraints)
    const importOrder = [
      'users',
      'employers', 
      'user_profiles',
      'user_documents',
      'jobs',
      'applications',
      'admin_users',
      'packages',
      'employer_packages'
    ];
    
    for (const tableName of importOrder) {
      if (exportData[tableName] && exportData[tableName].length > 0) {
        console.log(`  Importing ${tableName}...`);
        try {
          await targetDb(tableName).insert(exportData[tableName]);
          console.log(`    ✅ ${exportData[tableName].length} rows imported`);
        } catch (error) {
          console.log(`    ⚠️  Error importing ${tableName}: ${error.message}`);
        }
      }
    }
    
    // Verify migration
    console.log('\n🔍 Verifying migration...');
    for (const table of tables.rows) {
      const tableName = table.table_name;
      const sourceCount = exportData[tableName] ? exportData[tableName].length : 0;
      const targetCount = await targetDb(tableName).count('* as count').first();
      
      console.log(`  ${tableName}: ${sourceCount} → ${targetCount.count} rows`);
    }
    
    console.log('\n🎉 Database migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your backend environment variables to use Neon');
    console.log('2. Test the new database connection');
    console.log('3. Redeploy your backend');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Clean up connections
    if (sourceDb) {
      await sourceDb.destroy();
      console.log('🔌 Source database connection closed');
    }
    if (targetDb) {
      await targetDb.destroy();
      console.log('🔌 Target database connection closed');
    }
  }
}

// Run migration
migrateDatabase();
