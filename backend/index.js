require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', require('./routes/auth'));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 