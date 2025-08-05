// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.local' });
} else {
  require('dotenv').config();
}

// Helper function to get database connection config
function getConnectionConfig() {
  // If DATABASE_URL is provided, use it (preferred for production)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Otherwise, use individual parameters
  return {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL ? 
      process.env.DATABASE_URL + '?sslmode=require' : 
      getConnectionConfig(),
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?sslmode=require',
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
}; 