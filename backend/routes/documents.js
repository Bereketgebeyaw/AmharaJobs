// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config();
} else {
  // Default to development (load .env.local)
  require('dotenv').config({ path: '.env.local' });
}

const express = require('express');
const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(require('../knexfile')[environment]);
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = parseInt(userId);
  next();
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1,
    fieldSize: 50 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    // Allow all file types
    cb(null, true);
  }
});

// Get user's documents
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    const documents = await knex('user_documents')
      .where('user_id', userId)
      .orderBy('uploaded_at', 'desc');

    res.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Upload a document
router.post('/upload', authenticateUser, upload.single('document'), async (req, res) => {
  try {
    const userId = req.userId;
    const { document_type, title, description, is_default } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!document_type) {
      return res.status(400).json({ error: 'Document type is required' });
    }

    // If this is set as default, unset other defaults of the same type
    if (is_default === 'true' || is_default === true) {
      await knex('user_documents')
        .where('user_id', userId)
        .where('document_type', document_type)
        .update({ is_default: false });
    }

    // Create document record
    const [document] = await knex('user_documents').insert({
      user_id: userId,
      document_type: document_type,
      title: title || file.originalname,
      description: description || '',
      original_name: file.originalname,
      file_name: file.filename,
      file_path: file.path,
      file_size: file.size,
      mime_type: file.mimetype,
      file_type: file.mimetype,
      is_default: is_default === 'true' || is_default === true
    }).returning('*');

    res.status(201).json({ 
      message: 'Document uploaded successfully',
      document 
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Delete a document
router.delete('/:documentId', authenticateUser, async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.userId;

    // Get document info
    const document = await knex('user_documents')
      .where('id', documentId)
      .where('user_id', userId)
      .first();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }

    // Delete from database
    await knex('user_documents')
      .where('id', documentId)
      .del();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Update document (title, description, default status)
router.put('/:documentId', authenticateUser, async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.userId;
    const { title, description, is_default } = req.body;

    // Check if document exists and belongs to user
    const document = await knex('user_documents')
      .where('id', documentId)
      .where('user_id', userId)
      .first();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // If setting as default, unset other defaults of the same type
    if (is_default === true || is_default === 'true') {
      await knex('user_documents')
        .where('user_id', userId)
        .where('document_type', document.document_type)
        .where('id', '!=', documentId)
        .update({ is_default: false });
    }

    // Update document
    const [updatedDocument] = await knex('user_documents')
      .where('id', documentId)
      .update({
        title: title || document.title,
        description: description || document.description,
        is_default: is_default !== undefined ? is_default : document.is_default
      })
      .returning('*');

    res.json({ 
      message: 'Document updated successfully',
      document: updatedDocument 
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Download a document
router.get('/:documentId/download', authenticateUser, async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.userId;

    const document = await knex('user_documents')
      .where('id', documentId)
      .where('user_id', userId)
      .first();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(document.file_path, document.original_name);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

module.exports = router; 