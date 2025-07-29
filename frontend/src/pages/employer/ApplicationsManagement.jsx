import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useSearchParams } from 'react-router-dom';

const ApplicationsManagement = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(searchParams.get('job') || 'all');

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('API_ENDPOINTS.EMPLOYER_JOBS', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedJob === 'all' 
        ? 'API_ENDPOINTS.EMPLOYER_APPLICATIONS'
        : `API_ENDPOINTS.EMPLOYER_APPLICATIONS?job_id=${selectedJob}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Sort by application date (newest first)
        const sortedApplications = (data.applications || []).sort((a, b) => {
          const dateA = new Date(a.applied_at || a.created_at);
          const dateB = new Date(b.applied_at || b.created_at);
          return dateB - dateA;
        });
        setApplications(sortedApplications);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load applications');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`API_ENDPOINTS.EMPLOYER_APPLICATIONS/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));
      } else {
        alert('Failed to update application status');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      reviewed: '#2196f3',
      shortlisted: '#9c27b0',
      interviewed: '#ff5722',
      hired: '#4caf50',
      rejected: '#f44336'
    };
    return colors[status] || '#666';
  };

  const getStatusBadge = (status) => {
    return (
      <span style={{ 
        padding: '0.375rem 0.875rem', 
        borderRadius: '20px', 
        fontSize: '0.75rem', 
        fontWeight: '600',
        textTransform: 'uppercase',
        background: `${getStatusColor(status)}15`,
        color: getStatusColor(status),
        border: `1px solid ${getStatusColor(status)}30`,
        letterSpacing: '0.5px'
      }}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      reviewed: '👁️',
      shortlisted: '⭐',
      interviewed: '🤝',
      hired: '✅',
      rejected: '❌'
    };
    return icons[status] || '📋';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Helper to get the correct document URL
  const getDocumentUrl = (filePath) => {
    if (!filePath) return '#';
    const parts = filePath.split(/[/\\]/); // split on / or \
    const filename = parts[parts.length - 1];
    return `API_ENDPOINTS.UPLOADS_DOCUMENTS${filename}`;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: '#f8f9fa'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '2rem',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
            Loading applications...
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #f3f3f3', 
            borderTop: '3px solid var(--primary)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: '#f8f9fa'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '2rem',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ color: '#f44336', fontSize: '1.1rem', marginBottom: '1rem' }}>
            {error}
          </div>
          <button 
            onClick={fetchApplications}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fa',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ 
                color: '#1a1a1a', 
                marginBottom: '0.5rem', 
                fontSize: '2rem',
                fontWeight: '700'
              }}>
                Job Applications
              </h1>
              <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
                Review applications sorted by application date (newest first)
              </p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {applications.length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Applications</div>
            </div>
          </div>

          {/* Job Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ fontWeight: '600', color: '#333', fontSize: '1rem' }}>
              Filter by Job:
            </label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #e1e5e9',
                fontSize: '1rem',
                background: '#f8f9fa',
                minWidth: '250px'
              }}
            >
              <option value="all">All Jobs ({jobs.length})</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: '#fff', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: '#666', marginBottom: '1rem', fontSize: '1.5rem' }}>No applications found</h3>
            <p style={{ color: '#999', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
              {selectedJob === 'all' 
                ? 'No applications have been submitted to your job postings yet. Applications will appear here once candidates start applying.' 
                : 'No applications found for this job posting. Try checking other job postings.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((application, index) => (
              <div key={application.id} style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '16px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {/* Application Number */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  #{index + 1}
                </div>

                {/* Status Indicator */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '4px', 
                  background: `linear-gradient(90deg, ${getStatusColor(application.status)} 0%, ${getStatusColor(application.status)}80 100%)` 
                }} />

                <div style={{ marginBottom: '1rem' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#1a1a1a', 
                        fontSize: '1.25rem',
                        fontWeight: '600'
                      }}>
                        {application.applicant?.fullname || 'Unknown Applicant'}
                      </h3>
                      <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                        📧 {application.applicant?.email || 'No email'}
                      </p>
                      {application.applicant?.phone && (
                        <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                          📞 {application.applicant.phone}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                      {getStatusBadge(application.status)}
                      <div style={{ fontSize: '1.5rem' }}>
                        {getStatusIcon(application.status)}
                      </div>
                    </div>
                  </div>

                  {/* Job Info */}
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginBottom: '1rem' 
                  }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem' }}>
                      🎯 Applied for: {application.job?.title || 'Unknown Job'}
                    </h4>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      📍 {application.job?.location || 'Location not specified'}
                    </p>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                      💼 {application.job?.job_type || 'Job type not specified'}
                    </p>
                  </div>

                  {/* Cover Letter Preview */}
                  {application.cover_letter && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1rem' }}>
                        📝 Cover Letter Preview:
                      </h4>
                      <p style={{ 
                        color: '#666', 
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.5',
                        fontSize: '0.9rem'
                      }}>
                        {application.cover_letter}
                      </p>
                    </div>
                  )}

                  {/* Application Notes */}
                  {application.application_notes && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1rem' }}>
                        📋 Application Notes:
                      </h4>
                      <p style={{ 
                        color: '#666', 
                        margin: 0,
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                      }}>
                        {application.application_notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>
                      Applied: {formatDate(application.applied_at || application.created_at)}
                    </span>
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>
                      {new Date(application.applied_at || application.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {/* Resume Link */}
                    {application.resume_document && application.resume_document.file_path && (
                      <a 
                        href={getDocumentUrl(application.resume_document.file_path)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          background: '#f0f8ff',
                          border: '1px solid #e1f5fe',
                          transition: 'all 0.2s',
                          display: 'inline-block'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#e3f2fd';
                          e.target.style.borderColor = '#bbdefb';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#f0f8ff';
                          e.target.style.borderColor = '#e1f5fe';
                        }}
                        download={application.resume_document.title}
                      >
                        📄 View Resume
                      </a>
                    )}
                    {/* Cover Letter Link */}
                    {application.cover_letter_document && application.cover_letter_document.file_path && (
                      <a 
                        href={getDocumentUrl(application.cover_letter_document.file_path)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          color: '#2196f3',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          background: '#e3f2fd',
                          border: '1px solid #bbdefb',
                          transition: 'all 0.2s',
                          display: 'inline-block'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#bbdefb';
                          e.target.style.borderColor = '#2196f3';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#e3f2fd';
                          e.target.style.borderColor = '#bbdefb';
                        }}
                        download={application.cover_letter_document.title}
                      >
                        📝 View Cover Letter
                      </a>
                    )}

                    {/* Status Update Dropdown */}
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #e1e5e9',
                        fontSize: '0.9rem',
                        background: '#fff',
                        cursor: 'pointer',
                        minWidth: '120px'
                      }}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="reviewed">👁️ Reviewed</option>
                      <option value="shortlisted">⭐ Shortlisted</option>
                      <option value="interviewed">🤝 Interviewed</option>
                      <option value="hired">✅ Hired</option>
                      <option value="rejected">❌ Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ApplicationsManagement; 