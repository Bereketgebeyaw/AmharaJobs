import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';
import './MyApplications.css';

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
      const response = await fetch('API_ENDPOINTS.MY_APPLICATIONS', {
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
    <div className="myapplications-container">
      <div className="myapplications-inner">
        {/* Header */}
        <div className="myapplications-header">
          <h1>My Applications</h1>
          <p>Track the status of your job applications</p>
        </div>

        {loading ? (
          <div className="myapplications-loading">
            <div className="myapplications-loading-text">Loading applications...</div>
          </div>
        ) : applications.length === 0 ? (
          <div className="myapplications-empty">
            <h3>No applications yet</h3>
            <p>Start applying to jobs to see your applications here.</p>
            <button
              onClick={() => navigate('/')}
              className="myapplications-button myapplications-button-primary"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="myapplications-list">
            {applications.map(application => (
              <div 
                key={application.id} 
                className="myapplications-item"
                style={{ borderLeftColor: getStatusColor(application.status) }}
              >
                <div className="myapplications-item-content">
                  <div className="myapplications-job-info">
                    <h3 className="myapplications-job-title">
                      {application.job_title}
                    </h3>
                    <p className="myapplications-company">
                      {application.company_name}
                    </p>
                    
                    <div className="myapplications-details">
                      <span className="myapplications-detail-item">
                        <span className="myapplications-detail-icon">📍</span>
                        {application.job_location}
                      </span>
                      <span className="myapplications-detail-item">
                        <span className="myapplications-detail-icon">💼</span>
                        {application.job_type}
                      </span>
                      {application.resume_title && (
                        <span className="myapplications-detail-item">
                          <span className="myapplications-detail-icon">📄</span>
                          {application.resume_title}
                        </span>
                      )}
                      {application.cover_letter_title && (
                        <span className="myapplications-detail-item">
                          <span className="myapplications-detail-icon">✉️</span>
                          {application.cover_letter_title}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="myapplications-footer">
                    <span className="myapplications-date">
                      Applied: {formatDate(application.applied_at)}
                    </span>
                    <span className={`myapplications-status ${application.status}`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="myapplications-navigation">
          <button
            onClick={() => navigate('/')}
            className="myapplications-button myapplications-button-secondary"
          >
            Back to Jobs
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="myapplications-button myapplications-button-primary"
          >
            Manage Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyApplications; 