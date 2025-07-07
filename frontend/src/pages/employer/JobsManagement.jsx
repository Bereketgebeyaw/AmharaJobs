import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to access jobs');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/employer/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load jobs');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employer/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update the job in the local state
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        ));
      } else {
        alert('Failed to update job status');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employer/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== jobId));
      } else {
        alert('Failed to delete job');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#4caf50',
      inactive: '#f44336',
      draft: '#ff9800'
    };
    return colors[status] || '#666';
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div>Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'red', textAlign: 'center' }}>
          <div>{error}</div>
          <Link to="/employer/login" style={{ color: 'var(--primary)', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          My Job Postings
        </h1>
        <p style={{ color: '#666' }}>Manage and track your job postings</p>
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem'
            }}
          >
            <option value="all">All Jobs ({jobs.length})</option>
            <option value="active">Active ({jobs.filter(j => j.status === 'active').length})</option>
            <option value="inactive">Inactive ({jobs.filter(j => j.status === 'inactive').length})</option>
            <option value="draft">Draft ({jobs.filter(j => j.status === 'draft').length})</option>
          </select>
        </div>
        
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
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px #eee' 
        }}>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No jobs found</h3>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            {filter === 'all' ? 'You haven\'t posted any jobs yet.' : `No ${filter} jobs found.`}
          </p>
          <Link to="/employer/post-job" style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredJobs.map(job => (
            <div key={job.id} style={{ 
              background: '#fff', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px #eee',
              borderLeft: `4px solid ${getStatusColor(job.status)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.25rem' }}>
                    {job.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      📍 {job.location}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      💼 {job.job_type}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      ⏰ {job.experience_level}
                    </span>
                    {job.salary_range && (
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>
                        💰 {job.salary_range}
                      </span>
                    )}
                  </div>
                  <p style={{ 
                    color: '#666', 
                    margin: '0 0 1rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {job.description}
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    background: `${getStatusColor(job.status)}20`,
                    color: getStatusColor(job.status)
                  }}>
                    {job.status}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                    
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      style={{
                        background: '#f44336',
                        color: '#fff',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #eee'
              }}>
                <span style={{ color: '#999', fontSize: '0.8rem' }}>
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </span>
                <Link to={`/employer/applications?job=${job.id}`} style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  View Applications →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsManagement; 