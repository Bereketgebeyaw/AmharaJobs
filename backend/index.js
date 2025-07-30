require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { expireJobs } = require('./utils/jobExpiration');

const app = express();
app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', require('./routes/auth'));

// Use admin routes
app.use('/api/admin', require('./routes/admin'));

// Use employer routes
app.use('/api/employer', require('./routes/employer'));

// Use public job routes
app.use('/api/jobs', require('./routes/jobs'));

// Use applications routes
app.use('/api/applications', require('./routes/applications'));

// Use documents routes
app.use('/api/documents', require('./routes/documents'));

// Use profile routes
app.use('/api/auth/profile', require('./routes/profile'));

// Serve uploaded documents statically
app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads/documents')));

// Scheduled job expiration - runs every hour
setInterval(async () => {
  try {
    const expiredCount = await expireJobs();
    if (expiredCount > 0) {
      console.log(`Scheduled task: Expired ${expiredCount} jobs`);
    }
  } catch (error) {
    console.error('Scheduled job expiration error:', error);
  }
}, 60 * 60 * 1000); // Run every hour

// Also run once on server startup
expireJobs().then(count => {
  if (count > 0) {
    console.log(`Server startup: Expired ${count} jobs`);
  }
}).catch(error => {
  console.error('Startup job expiration error:', error);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 