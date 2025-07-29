import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Link } from 'react-router-dom';
import './JobsManagement.css';

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [modalType, setModalType] = useState(''); // 'success', 'error', 'info', 'confirm'
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

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

      const response = await fetch('API_ENDPOINTS.EMPLOYER_JOBS', {
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
      const response = await fetch(`API_ENDPOINTS.EMPLOYER_JOBS/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
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

  const handleDeleteJob = (jobId) => {
    setJobToDelete(jobId);
    setModalType('confirm');
    setModalMessage('Are you sure you want to delete this job? This action cannot be undone.');
    setShowModal(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`API_ENDPOINTS.EMPLOYER_JOBS/${jobToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== jobToDelete));
        setModalType('success');
        setModalMessage('Job deleted successfully!');
        setShowModal(true);
      } else {
        setModalType('error');
        setModalMessage('Failed to delete job');
        setShowModal(true);
      }
    } catch (err) {
      setModalType('error');
      setModalMessage('Network error. Please try again.');
      setShowModal(true);
    } finally {
      setJobToDelete(null);
    }
  };

  const getStatusColorClass = (status) => {
    if (status === 'active') return 'active';
    if (status === 'inactive') return 'inactive';
    if (status === 'draft') return 'draft';
    return '';
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (loading) {
    return (
      <div className="jobsmanagement-loading">
        <div>Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobsmanagement-error">
        <div>
          <div className="jobsmanagement-error-message">{error}</div>
          <Link to="/employer/login" className="jobsmanagement-error-link">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="jobsmanagement-container">
      {/* Header */}
      <div className="jobsmanagement-header">
        <h1 className="jobsmanagement-title">My Job Postings</h1>
        <p className="jobsmanagement-subtitle">Manage and track your job postings</p>
      </div>

      {/* Actions */}
      <div className="jobsmanagement-actions">
        <div className="jobsmanagement-filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="jobsmanagement-filter-select"
          >
            <option value="all">All Jobs ({jobs.length})</option>
            <option value="active">Active ({jobs.filter(j => j.status === 'active').length})</option>
            <option value="inactive">Inactive ({jobs.filter(j => j.status === 'inactive').length})</option>
            <option value="draft">Draft ({jobs.filter(j => j.status === 'draft').length})</option>
          </select>
        </div>
        <Link to="/employer/post-job" className="jobsmanagement-new-job-btn">
          Post New Job
        </Link>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="jobsmanagement-empty">
          <h3 className="jobsmanagement-empty-title">No jobs found</h3>
          <p className="jobsmanagement-empty-message">
            {filter === 'all' ? "You haven't posted any jobs yet." : `No ${filter} jobs found.`}
          </p>
          <Link to="/employer/post-job" className="jobsmanagement-empty-btn">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="jobsmanagement-list">
          {filteredJobs.map(job => (
            <div key={job.id} className={`jobsmanagement-item ${getStatusColorClass(job.status)}`}>
              <div className="jobsmanagement-item-content">
                <div className="jobsmanagement-item-main">
                  <h3 className="jobsmanagement-item-title">{job.title}</h3>
                  <div className="jobsmanagement-item-details">
                    <span className="jobsmanagement-item-detail">📍 {job.location}</span>
                    <span className="jobsmanagement-item-detail">💼 {job.job_type}</span>
                    <span className="jobsmanagement-item-detail">⏰ {job.experience_level}</span>
                    {job.salary_range && (
                      <span className="jobsmanagement-item-detail">💰 {job.salary_range}</span>
                    )}
                  </div>
                  <p className="jobsmanagement-item-description">{job.description}</p>
                </div>
                <div className="jobsmanagement-item-actions">
                  <span className={`jobsmanagement-status-badge ${getStatusColorClass(job.status)}`}>
                    {job.status}
                  </span>
                  <div className="jobsmanagement-controls">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      className="jobsmanagement-status-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="jobsmanagement-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="jobsmanagement-item-footer">
                <span className="jobsmanagement-item-date">
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </span>
                <Link to={`/employer/applications?job=${job.id}`} className="jobsmanagement-applications-link">
                  View Applications →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Confirmation and Feedback */}
      {showModal && (
        <div className="jobsmanagement-modal-overlay">
          <div className="jobsmanagement-modal">
            {/* Icon */}
            <div className={`jobsmanagement-modal-icon ${modalType}`}>
              {modalType === 'success' && '✅'}
              {modalType === 'info' && 'ℹ️'}
              {modalType === 'error' && '❌'}
              {modalType === 'confirm' && '⚠️'}
            </div>
            <h2 className={`jobsmanagement-modal-title ${modalType}`}>
              {modalType === 'success' && 'Success'}
              {modalType === 'info' && 'Info'}
              {modalType === 'error' && 'Error'}
              {modalType === 'confirm' && 'Confirm Deletion'}
            </h2>
            <p className="jobsmanagement-modal-message">{modalMessage}</p>
            <div className="jobsmanagement-modal-buttons">
              {modalType === 'confirm' ? (
                <>
                  <button
                    onClick={confirmDeleteJob}
                    className="jobsmanagement-modal-btn confirm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => { setShowModal(false); setJobToDelete(null); }}
                    className="jobsmanagement-modal-btn cancel"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowModal(false)}
                  className={`jobsmanagement-modal-btn ${modalType}`}
                >
                  Close
                </button>
              )}
            </div>
            <button
              onClick={() => { setShowModal(false); setJobToDelete(null); }}
              className="jobsmanagement-modal-close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsManagement; 