import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5000/api/applications/my-applications', {
        headers: {
          'user-id': userId
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      reviewed: '#2196f3',
      shortlisted: '#4caf50',
      interviewed: '#9c27b0',
      hired: '#2e7d32',
      rejected: '#f44336',
      withdrawn: '#666'
    };
    return colors[status] || '#666';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Review',
      reviewed: 'Reviewed',
      shortlisted: 'Shortlisted',
      interviewed: 'Interviewed',
      hired: 'Hired',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '0.5rem' }}>
            My Applications
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Track the status of your job applications
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading applications...</div>
          </div>
        ) : applications.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px #eee' 
          }}>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>No applications yet</h3>
            <p style={{ color: '#999', marginBottom: '2rem' }}>
              Start applying to jobs to see your applications here.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {applications.map(application => (
              <div key={application.id} style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px #eee',
                borderLeft: `4px solid ${getStatusColor(application.status)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 0.5rem 0', 
                      color: '#333', 
                      fontSize: '1.25rem'
                    }}>
                      {application.job_title}
                    </h3>
                    <p style={{ color: '#666', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
                      {application.company_name}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>
                        📍 {application.job_location}
                      </span>
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>
                        💼 {application.job_type}
                      </span>
                      {application.resume_title && (
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                          📄 {application.resume_title}
                        </span>
                      )}
                      {application.cover_letter_title && (
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                          ✉️ {application.cover_letter_title}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid #eee'
                    }}>
                      <span style={{ color: '#999', fontSize: '0.9rem' }}>
                        Applied: {formatDate(application.applied_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      background: `${getStatusColor(application.status)}20`,
                      color: getStatusColor(application.status)
                    }}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            onClick={() => navigate('/profile')}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Manage Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyApplications; 