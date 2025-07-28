import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to access dashboard');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/employer/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load dashboard');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div>
          <div className="dashboard-error-message">{error}</div>
          <Link to="/login" className="dashboard-error-link">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-loading">
        <div>No data available</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome back, {dashboardData.employer.company_name}!
        </h1>
        <p className="dashboard-subtitle">Manage your job postings and applications</p>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <h3 className="dashboard-stat-title">Total Jobs</h3>
          <div className="dashboard-stat-value">
            {dashboardData.stats.totalJobs}
          </div>
        </div>

        <div className="dashboard-stat-card active">
          <h3 className="dashboard-stat-title">Active Jobs</h3>
          <div className="dashboard-stat-value">
            {dashboardData.stats.activeJobs}
          </div>
        </div>

        <div className="dashboard-stat-card applications">
          <h3 className="dashboard-stat-title">Total Applications</h3>
          <div className="dashboard-stat-value">
            {dashboardData.stats.totalApplications}
          </div>
        </div>

        <div className="dashboard-stat-card pending">
          <h3 className="dashboard-stat-title">Pending Applications</h3>
          <div className="dashboard-stat-value">
            {dashboardData.stats.pendingApplications}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h3 className="dashboard-actions-title">Quick Actions</h3>
        <div className="dashboard-actions-buttons">
          <Link to="/employer/post-job" className="dashboard-action-btn">
            Post New Job
          </Link>
          <Link to="/employer/jobs" className="dashboard-action-btn blue">
            View All Jobs
          </Link>
          <Link to="/employer/applications" className="dashboard-action-btn orange">
            View Applications
          </Link>
        </div>
      </div>

      {/* Recent Jobs and Applications */}
      <div className="dashboard-content">
        {/* Recent Jobs */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Recent Jobs</h3>
            <Link to="/employer/jobs" className="dashboard-card-link">
              View All
            </Link>
          </div>
          {dashboardData.recentJobs.length === 0 ? (
            <p className="dashboard-empty">No jobs posted yet</p>
          ) : (
            <div>
              {dashboardData.recentJobs.map(job => (
                <div key={job.id} className={`dashboard-item ${job.is_active ? 'active' : 'inactive'}`}>
                  <h4 className="dashboard-item-title">{job.title}</h4>
                  <p className="dashboard-item-subtitle">
                    {job.location} • {job.job_type}
                  </p>
                  <div className="dashboard-item-footer">
                    <span className={`dashboard-status ${job.is_active ? 'active' : 'inactive'}`}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="dashboard-date">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Recent Applications</h3>
            <Link to="/employer/applications" className="dashboard-card-link">
              View All
            </Link>
          </div>
          {dashboardData.recentApplications.length === 0 ? (
            <p className="dashboard-empty">No applications yet</p>
          ) : (
            <div>
              {dashboardData.recentApplications.map(application => (
                <div key={application.id} className="dashboard-item">
                  <h4 className="dashboard-item-title">{application.applicant_name}</h4>
                  <p className="dashboard-item-subtitle">
                    Applied for: {application.job_title}
                  </p>
                  <div className="dashboard-item-footer">
                    <span className={`dashboard-status ${application.status}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span className="dashboard-date">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 