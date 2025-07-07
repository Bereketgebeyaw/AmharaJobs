import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const ApplicationsManagement = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(searchParams.get('job') || 'all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employer/jobs', {
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
        ? 'http://localhost:5000/api/employer/applications'
        : `http://localhost:5000/api/employer/applications?job_id=${selectedJob}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
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
      const response = await fetch(`http://localhost:5000/api/employer/applications/${applicationId}/status`, {
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
        padding: '0.25rem 0.75rem', 
        borderRadius: '12px', 
        fontSize: '0.8rem', 
        fontWeight: '500',
        textTransform: 'uppercase',
        background: `${getStatusColor(status)}20`,
        color: getStatusColor(status)
      }}>
        {status}
      </span>
    );
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div>Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'red', textAlign: 'center' }}>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Job Applications
        </h1>
        <p style={{ color: '#666' }}>Review and manage applications for your job postings</p>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Filter by Job:
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              minWidth: '200px'
            }}
          >
            <option value="all">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem'
            }}
          >
            <option value="all">All Status ({applications.length})</option>
            <option value="pending">Pending ({applications.filter(a => a.status === 'pending').length})</option>
            <option value="reviewed">Reviewed ({applications.filter(a => a.status === 'reviewed').length})</option>
            <option value="shortlisted">Shortlisted ({applications.filter(a => a.status === 'shortlisted').length})</option>
            <option value="interviewed">Interviewed ({applications.filter(a => a.status === 'interviewed').length})</option>
            <option value="hired">Hired ({applications.filter(a => a.status === 'hired').length})</option>
            <option value="rejected">Rejected ({applications.filter(a => a.status === 'rejected').length})</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px #eee' 
        }}>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No applications found</h3>
          <p style={{ color: '#999' }}>
            {selectedJob === 'all' 
              ? 'No applications have been submitted to your job postings yet.' 
              : 'No applications found for this job posting.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredApplications.map(application => (
            <div key={application.id} style={{ 
              background: '#fff', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px #eee',
              borderLeft: `4px solid ${getStatusColor(application.status)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.25rem' }}>
                    {application.applicant.fullname}
                  </h3>
                  <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>
                    📧 {application.applicant.email}
                  </p>
                  {application.applicant.phone && (
                    <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>
                      📞 {application.applicant.phone}
                    </p>
                  )}
                  <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
                    🎯 Applied for: <strong>{application.job.title}</strong>
                  </p>
                  
                  {application.cover_letter && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Cover Letter:</h4>
                      <p style={{ 
                        color: '#666', 
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.5'
                      }}>
                        {application.cover_letter}
                      </p>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  {getStatusBadge(application.status)}
                  
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
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
                  Applied: {new Date(application.created_at).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {application.resume_url && (
                    <a 
                      href={application.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      📄 View Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement; 