import React, { useState, useEffect } from 'react';

const JobApplicationModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    resume_document_id: '',
    cover_letter_document_id: '',
    application_notes: ''
  });
  const [modalType, setModalType] = useState(''); // 'success', 'info', 'error'
  const [modalMessage, setModalMessage] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserDocuments();
    }
  }, [isOpen]);

  const fetchUserDocuments = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5000/api/documents', {
        headers: {
          'user-id': userId
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
        
        // Set default resume if available
        const defaultResume = data.documents.find(doc => 
          doc.document_type === 'resume' && doc.is_default
        );
        if (defaultResume) {
          setFormData(prev => ({ ...prev, resume_document_id: defaultResume.id }));
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resume_document_id) {
      setModalType('error');
      setModalMessage('Please select a resume.');
      setShowStatusModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify({
          job_id: job.id,
          ...formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setModalType('success');
        setModalMessage('Application submitted successfully!');
        setShowStatusModal(true);
        onSuccess(data.application);
      } else {
        const error = await response.json();
        if (error.error && /applied/i.test(error.error)) {
          setModalType('info');
          setModalMessage('You have already applied for this job.');
        } else {
          setModalType('error');
          setModalMessage(error.error || 'Failed to submit application');
        }
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setModalType('error');
      setModalMessage('Failed to submit application. Please try again.');
      setShowStatusModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    if (modalType === 'success') {
      onClose();
    }
  };

  const getResumes = () => documents.filter(doc => doc.document_type === 'resume');
  const getCoverLetters = () => documents.filter(doc => doc.document_type === 'cover_letter');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#333', margin: 0 }}>
            Apply for {job.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {/* Job Info */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1.5rem' 
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
            {job.company_name}
          </h3>
          <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
            📍 {job.location} • 💼 {job.job_type} • ⏰ {job.experience_level}
          </p>
          {job.salary_range && (
            <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>
              💰 {job.salary_range}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Resume Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Select Resume * <span style={{ color: '#f44336' }}>*</span>
            </label>
            {getResumes().length === 0 ? (
              <div style={{ 
                background: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                padding: '1rem', 
                borderRadius: '4px',
                color: '#856404',
                marginBottom: '0.5rem'
              }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  No resumes found. Please upload a resume to your profile first.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.href = '/profile';
                  }}
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Upload Resume
                </button>
              </div>
            ) : (
              <select
                value={formData.resume_document_id}
                onChange={(e) => setFormData({ ...formData, resume_document_id: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid #e1e5e9',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,115,47,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Select a resume</option>
                {getResumes().map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {(doc.title || doc.original_name || doc.filename)} {doc.is_default ? '(Default)' : ''}
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* Cover Letter Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Select Cover Letter (Optional)
            </label>
            {getCoverLetters().length === 0 ? (
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                No cover letters available. You can upload one to your profile.
              </div>
            ) : (
              <select
                value={formData.cover_letter_document_id}
                onChange={(e) => setFormData({...formData, cover_letter_document_id: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="">No cover letter</option>
                {getCoverLetters().map(coverLetter => (
                  <option key={coverLetter.id} value={coverLetter.id}>
                    {coverLetter.title} {coverLetter.is_default && '(Default)'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Application Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.application_notes}
              onChange={(e) => setFormData({...formData, application_notes: e.target.value})}
              placeholder="Add any additional information you'd like the employer to know..."
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                background: '#666',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.resume_document_id}
              style={{
                background: submitting ? '#ccc' : 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
      {showStatusModal && (
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
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            {/* Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              fontSize: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: modalType === 'success'
                ? 'linear-gradient(135deg, #e0f7e9 0%, #b2f2dd 100%)'
                : 'linear-gradient(135deg, #e3f0fd 0%, #b3d8fd 100%)'
            }}>
              {modalType === 'success' ? '✅' : 'ℹ️'}
            </div>
            <h2 style={{
              color: modalType === 'success' ? '#00732F' : '#1976d2',
              fontWeight: 700,
              fontSize: '1.6rem',
              margin: '0 0 1rem 0'
            }}>
              {modalType === 'success' ? 'Application Submitted!' : 'Already Applied'}
            </h2>
            <p style={{
              color: '#444',
              fontSize: '1.1rem',
              margin: '0 0 2rem 0'
            }}>
              {modalMessage}
            </p>
            <button
              onClick={closeStatusModal}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: 'linear-gradient(135deg, #00732F 0%, #2e7d32 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              {modalType === 'success' ? '🎉 Continue Browsing' : 'OK'}
            </button>
            <button
              onClick={closeStatusModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#888'
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationModal; 