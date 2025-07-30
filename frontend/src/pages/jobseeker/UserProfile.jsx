import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    skills: '',
    experience: '',
    education: '',
    bio: '',
    linkedin_url: '',
    website_url: ''
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    document_type: 'resume',
    title: '',
    description: '',
    is_default: false
  });
  const [modalType, setModalType] = useState(''); // 'success', 'error', 'info'
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchDocuments();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5000/api/auth/profile/${userId}`, {
        headers: {
          'user-id': userId
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        // If profile doesn't exist, get basic user info from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setProfile({
            fullname: user.fullname || '',
            email: user.email || '',
            phone: user.phone || '',
            address: '',
            date_of_birth: '',
            gender: '',
            skills: '',
            experience: '',
            education: '',
            bio: '',
            linkedin_url: '',
            website_url: ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage data
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setProfile({
          fullname: user.fullname || '',
          email: user.email || '',
          phone: user.phone || '',
          address: '',
          date_of_birth: '',
          gender: '',
          skills: '',
          experience: '',
          education: '',
          bio: '',
          linkedin_url: '',
          website_url: ''
        });
      }
    }
  };

  const fetchDocuments = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(API_ENDPOINTS.DOCUMENTS, {
        headers: {
          'user-id': userId
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5000/api/auth/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setModalType('success');
        setModalMessage('Profile updated successfully!');
        setShowModal(true);
        setIsEditing(false);
      } else {
        setModalType('error');
        setModalMessage('Failed to update profile');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalType('error');
      setModalMessage('Failed to update profile');
      setShowModal(true);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setModalType('info');
      setModalMessage('Please select a file');
      setShowModal(true);
      return;
    }

    setUploading(true);
    try {
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('document_type', uploadForm.document_type);
      formData.append('title', uploadForm.title || selectedFile.name);
      formData.append('description', uploadForm.description);
      formData.append('is_default', uploadForm.is_default);

      const response = await fetch(API_ENDPOINTS.DOCUMENTS_UPLOAD, {
        method: 'POST',
        headers: {
          'user-id': userId
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments([data.document, ...documents]);
        setSelectedFile(null);
        setUploadForm({
          document_type: 'resume',
          title: '',
          description: '',
          is_default: false
        });
        setModalType('success');
        setModalMessage('Document uploaded successfully!');
        setShowModal(true);
      } else {
        const error = await response.json();
        setModalType('error');
        setModalMessage(error.error || 'Upload failed');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setModalType('error');
      setModalMessage('Upload failed');
      setShowModal(true);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(API_ENDPOINTS.DOCUMENT_DELETE(documentId), {
        method: 'DELETE',
        headers: {
          'user-id': userId
        }
      });

      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== documentId));
        setModalType('success');
        setModalMessage('Document deleted successfully!');
        setShowModal(true);
      } else {
        setModalType('error');
        setModalMessage('Failed to delete document');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      setModalType('error');
      setModalMessage('Failed to delete document');
      setShowModal(true);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeIcon = (type) => {
    const icons = {
      resume: '📄',
      certificate: '🏆',
      cover_letter: '✉️',
      other: '📁'
    };
    return icons[type] || '📄';
  };

  return (
    <div className="userprofile-container">
      <div className="userprofile-inner">
        {/* Header */}
        <div className="userprofile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and documents</p>
        </div>

        <div className="userprofile-grid">
          {/* Profile Information */}
          <div className="userprofile-card">
            <div className="userprofile-card-header">
              <h2 className="userprofile-card-title">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`userprofile-button ${isEditing ? 'userprofile-button-secondary' : 'userprofile-button-primary'}`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form>
              <div className="userprofile-form-grid">
                <div className="userprofile-form-group">
                  <label className="userprofile-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullname"
                    value={profile.fullname}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="userprofile-input"
                  />
                </div>
                <div className="userprofile-form-group">
                  <label className="userprofile-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="userprofile-input"
                  />
                </div>
              </div>

              <div className="userprofile-form-grid">
                <div className="userprofile-form-group">
                  <label className="userprofile-label">Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="userprofile-input"
                  />
                </div>
                <div className="userprofile-form-group">
                  <label className="userprofile-label">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={profile.date_of_birth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="userprofile-input"
                  />
                </div>
              </div>

              <div className="userprofile-form-group">
                <label className="userprofile-label">Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className="userprofile-textarea"
                />
              </div>

              <div className="userprofile-form-grid">
                <div className="userprofile-form-group">
                  <label className="userprofile-label">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="userprofile-select"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="userprofile-form-group">
                  <label className="userprofile-label">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={profile.linkedin_url}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="userprofile-input"
                  />
                </div>
              </div>

              <div className="userprofile-form-group">
                <label className="userprofile-label">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="userprofile-textarea"
                />
              </div>

              <div className="userprofile-form-group">
                <label className="userprofile-label">Skills</label>
                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="e.g., JavaScript, React, Node.js, Project Management"
                  className="userprofile-textarea"
                />
              </div>

              <div className="userprofile-form-group">
                <label className="userprofile-label">Experience</label>
                <textarea
                  name="experience"
                  value={profile.experience}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="4"
                  placeholder="Describe your work experience..."
                  className="userprofile-textarea"
                />
              </div>

              <div className="userprofile-form-group">
                <label className="userprofile-label">Education</label>
                <textarea
                  name="education"
                  value={profile.education}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="Your educational background..."
                  className="userprofile-textarea"
                />
              </div>

              {isEditing && (
                <div className="userprofile-form-grid">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="userprofile-button userprofile-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="userprofile-button userprofile-button-primary"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Document Management */}
          <div className="userprofile-card">
            <h2 className="userprofile-card-title">Document Management</h2>

            {/* Upload Form */}
            <div className="userprofile-upload-section">
              <h3 className="userprofile-upload-title">Upload New Document</h3>
              <form onSubmit={handleUpload}>
                <div className="userprofile-form-group">
                  <label className="userprofile-label">Document Type</label>
                  <select
                    value={uploadForm.document_type}
                    onChange={(e) => setUploadForm({...uploadForm, document_type: e.target.value})}
                    className="userprofile-select"
                  >
                    <option value="resume">Resume/CV</option>
                    <option value="certificate">Certificate</option>
                    <option value="cover_letter">Cover Letter</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="userprofile-form-group">
                  <label className="userprofile-label">Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer Resume"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="userprofile-input"
                  />
                </div>

                <div className="userprofile-form-group">
                  <label className="userprofile-label">File</label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="*/*"
                    className="userprofile-file-input"
                  />
                </div>

                <div className="userprofile-checkbox-group">
                  <input
                    type="checkbox"
                    checked={uploadForm.is_default}
                    onChange={(e) => setUploadForm({...uploadForm, is_default: e.target.checked})}
                    className="userprofile-checkbox"
                  />
                  <label>Set as default for this document type</label>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="userprofile-button userprofile-button-primary"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </form>
            </div>

            {/* Documents List */}
            <div>
              <h3 className="userprofile-upload-title">My Documents</h3>

              {loading ? (
                <div className="userprofile-loading">
                  <div className="userprofile-loading-text">Loading documents...</div>
                </div>
              ) : documents.length === 0 ? (
                <div className="userprofile-empty">
                  <p>No documents uploaded yet.</p>
                  <p>Upload your first document to get started!</p>
                </div>
              ) : (
                <div className="userprofile-documents-list">
                  {documents.map(doc => (
                    <div key={doc.id} className="userprofile-document-item">
                      <div className="userprofile-document-info">
                        <span className="userprofile-document-icon">
                          {getDocumentTypeIcon(doc.document_type)}
                        </span>
                        <div className="userprofile-document-details">
                          <h4>
                            {doc.title}
                            {doc.is_default && (
                              <span className="userprofile-badge">Default</span>
                            )}
                          </h4>
                          <p>
                            {doc.original_name} • {formatFileSize(doc.file_size)} • {doc.document_type}
                          </p>
                          <p className="userprofile-document-meta">
                            Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="userprofile-button userprofile-button-danger"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="userprofile-navigation">
          <button
            onClick={() => navigate('/')}
            className="userprofile-button userprofile-button-secondary"
          >
            Back to Jobs
          </button>
          <button
            onClick={() => navigate('/my-applications')}
            className="userprofile-button userprofile-button-primary"
          >
            View My Applications
          </button>
        </div>
      </div>

      {/* Modal for Feedback */}
      {showModal && (
        <div className="userprofile-modal">
          <div className="userprofile-modal-content">
            <div className={`userprofile-modal-icon ${modalType}`}>
              {modalType === 'success' && '✅'}
              {modalType === 'info' && 'ℹ️'}
              {modalType === 'error' && '❌'}
            </div>
            <h2 className={`userprofile-modal-title ${modalType}`}>
              {modalType === 'success' && 'Success'}
              {modalType === 'info' && 'Info'}
              {modalType === 'error' && 'Error'}
            </h2>
            <p className="userprofile-modal-message">
              {modalMessage}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="userprofile-button userprofile-button-primary"
            >
              Close
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="userprofile-modal-close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 