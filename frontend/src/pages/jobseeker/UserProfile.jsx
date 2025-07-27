import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('http://localhost:5000/api/documents', {
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

      const response = await fetch('http://localhost:5000/api/documents/upload', {
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
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
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
    <div style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '0.5rem' }}>
            My Profile
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Manage your personal information and documents
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Profile Information */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#333', margin: 0 }}>
                Personal Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  background: isEditing ? '#666' : 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={profile.fullname}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: isEditing ? '#fff' : '#f9f9f9'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: isEditing ? '#fff' : '#f9f9f9'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Phone *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: isEditing ? '#fff' : '#f9f9f9'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={profile.date_of_birth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: isEditing ? '#fff' : '#f9f9f9'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Address
                </label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: isEditing ? '#fff' : '#f9f9f9',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: isEditing ? '#fff' : '#f9f9f9'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={profile.linkedin_url}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/yourprofile"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: isEditing ? '#fff' : '#f9f9f9'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: isEditing ? '#fff' : '#f9f9f9',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Skills
                </label>
                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="e.g., JavaScript, React, Node.js, Project Management"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: isEditing ? '#fff' : '#f9f9f9',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={profile.experience}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="4"
                  placeholder="Describe your work experience..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: isEditing ? '#fff' : '#f9f9f9',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Education
                </label>
                <textarea
                  name="education"
                  value={profile.education}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="Your educational background..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: isEditing ? '#fff' : '#f9f9f9',
                    resize: 'vertical'
                  }}
                />
              </div>

              {isEditing && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      background: '#666',
                      color: '#fff',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      background: saving ? '#ccc' : 'var(--primary)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Document Management */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px #eee' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>
              Document Management
            </h2>

            {/* Upload Form */}
            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
                Upload New Document
              </h3>
              <form onSubmit={handleUpload}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Document Type
                  </label>
                  <select
                    value={uploadForm.document_type}
                    onChange={(e) => setUploadForm({...uploadForm, document_type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="resume">Resume/CV</option>
                    <option value="certificate">Certificate</option>
                    <option value="cover_letter">Cover Letter</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer Resume"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="*/*"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={uploadForm.is_default}
                      onChange={(e) => setUploadForm({...uploadForm, is_default: e.target.checked})}
                    />
                    Set as default for this document type
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  style={{
                    background: uploading ? '#ccc' : 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '4px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    width: '100%'
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </form>
            </div>

            {/* Documents List */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
                My Documents
              </h3>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading documents...</div>
                </div>
              ) : documents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  <p>No documents uploaded yet.</p>
                  <p>Upload your first document to get started!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {documents.map(doc => (
                    <div key={doc.id} style={{
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>
                          {getDocumentTypeIcon(doc.document_type)}
                        </span>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
                            {doc.title}
                            {doc.is_default && (
                              <span style={{
                                background: 'var(--primary)',
                                color: '#fff',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                marginLeft: '0.5rem'
                              }}>
                                Default
                              </span>
                            )}
                          </h4>
                          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                            {doc.original_name} • {formatFileSize(doc.file_size)} • {doc.document_type}
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#999', fontSize: '0.8rem' }}>
                            Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        style={{
                          background: '#f44336',
                          color: '#fff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
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
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#666',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Back to Jobs
          </button>
          <button
            onClick={() => navigate('/my-applications')}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View My Applications
          </button>
        </div>
      </div>
      {/* Consistent Modal for Feedback */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '450px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out',
            position: 'relative'
          }}>
            {/* Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              background: modalType === 'success'
                ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
                : modalType === 'info'
                ? 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
                : 'linear-gradient(135deg, #f44336 0%, #b71c1c 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
              boxShadow: modalType === 'success'
                ? '0 8px 25px rgba(76,175,80,0.3)'
                : modalType === 'info'
                ? '0 8px 25px rgba(33,150,243,0.3)'
                : '0 8px 25px rgba(244,67,54,0.3)'
            }}>
              {modalType === 'success' && '✅'}
              {modalType === 'info' && 'ℹ️'}
              {modalType === 'error' && '❌'}
            </div>
            <h2 style={{
              color: modalType === 'success'
                ? '#388e3c'
                : modalType === 'info'
                ? '#1976d2'
                : '#b71c1c',
              margin: '0 0 1rem 0',
              fontSize: '1.6rem',
              fontWeight: '700'
            }}>
              {modalType === 'success' && 'Success'}
              {modalType === 'info' && 'Info'}
              {modalType === 'error' && 'Error'}
            </h2>
            <p style={{
              color: '#666',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              margin: '0 0 2rem 0'
            }}>
              {modalMessage}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.75rem 2rem',
                  background: modalType === 'success'
                    ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
                    : modalType === 'info'
                    ? 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
                    : 'linear-gradient(135deg, #f44336 0%, #b71c1c 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: modalType === 'success'
                    ? '0 4px 15px rgba(76,175,80,0.3)'
                    : modalType === 'info'
                    ? '0 4px 15px rgba(33,150,243,0.3)'
                    : '0 4px 15px rgba(244,67,54,0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = modalType === 'success'
                    ? '0 6px 20px rgba(76,175,80,0.4)'
                    : modalType === 'info'
                    ? '0 6px 20px rgba(33,150,243,0.4)'
                    : '0 6px 20px rgba(244,67,54,0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = modalType === 'success'
                    ? '0 4px 15px rgba(76,175,80,0.3)'
                    : modalType === 'info'
                    ? '0 4px 15px rgba(33,150,243,0.3)'
                    : '0 4px 15px rgba(244,67,54,0.3)';
                }}
              >
                Close
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f5f5f5';
                e.target.style.color = '#333';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#666';
              }}
            >
              ×
            </button>
          </div>
          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 