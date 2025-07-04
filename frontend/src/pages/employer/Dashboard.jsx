import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'red', textAlign: 'center' }}>
          <div>{error}</div>
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div>No data available</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Welcome back, {dashboardData.employer.company_name}!
        </h1>
        <p style={{ color: '#666' }}>Manage your job postings and applications</p>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px #eee',
          borderLeft: '4px solid var(--primary)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Total Jobs</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {dashboardData.stats.totalJobs}
          </div>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px #eee',
          borderLeft: '4px solid #4caf50'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Active Jobs</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
            {dashboardData.stats.activeJobs}
          </div>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px #eee',
          borderLeft: '4px solid #2196f3'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Total Applications</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196f3' }}>
            {dashboardData.stats.totalApplications}
          </div>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px #eee',
          borderLeft: '4px solid #ff9800'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Pending Applications</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>
            {dashboardData.stats.pendingApplications}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        background: '#fff', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px #eee',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/employer/post-job" style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Post New Job
          </Link>
          <Link to="/employer/jobs" style={{
            background: '#2196f3',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            View All Jobs
          </Link>
          <Link to="/employer/applications" style={{
            background: '#ff9800',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            View Applications
          </Link>
        </div>
      </div>

      {/* Recent Jobs and Applications */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Recent Jobs */}
        <div style={{ 
          background: '#fff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px #eee'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#333' }}>Recent Jobs</h3>
            <Link to="/employer/jobs" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
              View All
            </Link>
          </div>
          {dashboardData.recentJobs.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No jobs posted yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dashboardData.recentJobs.map(job => (
                <div key={job.id} style={{ 
                  padding: '1rem', 
                  border: '1px solid #eee', 
                  borderRadius: '4px',
                  background: job.is_active ? '#f9f9f9' : '#f5f5f5'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{job.title}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                    {job.location} • {job.job_type}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '12px',
                      background: job.is_active ? '#e8f5e8' : '#f0f0f0',
                      color: job.is_active ? '#2e7d32' : '#666'
                    }}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div style={{ 
          background: '#fff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px #eee'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#333' }}>Recent Applications</h3>
            <Link to="/employer/applications" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
              View All
            </Link>
          </div>
          {dashboardData.recentApplications.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No applications yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dashboardData.recentApplications.map(application => (
                <div key={application.id} style={{ 
                  padding: '1rem', 
                  border: '1px solid #eee', 
                  borderRadius: '4px'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{application.applicant_name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                    Applied for: {application.job_title}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '12px',
                      background: '#e3f2fd',
                      color: getStatusColor(application.status)
                    }}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
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