// server/db.js
import pg from "pg"

// Use environment variables for production, fallback to local development values
const db = new pg.Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost", 
  database: process.env.DB_NAME || "amharajobs",
  password: process.env.DB_PASSWORD || "bereket",
  port: process.env.DB_PORT || 5433,
  // Add SSL for production databases
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

db.connect()  // Establish the connection

export default db; 