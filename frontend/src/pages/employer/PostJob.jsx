import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: '',
    experience_level: '',
    salary_range: '',
    benefits: '',
    application_deadline: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(''); // 'success', 'error', 'info'
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = 'Job title is required';
    if (!form.description) errs.description = 'Job description is required';
    if (!form.requirements) errs.requirements = 'Job requirements are required';
    if (!form.location) errs.location = 'Job location is required';
    if (!form.job_type) errs.job_type = 'Job type is required';
    if (!form.experience_level) errs.experience_level = 'Experience level is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('API_ENDPOINTS.EMPLOYER_JOBS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });

        if (response.ok) {
          setModalType('success');
          setModalMessage('Your job application has been sent to the admin and is waiting for approval. You will get an email when it is approved.');
          setShowModal(true);
        } else {
          const errorData = await response.json();
          setErrors({ api: errorData.error || 'Failed to post job' });
        }
      } catch (err) {
        setErrors({ api: 'Network error. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Animation for card fade-in
  useEffect(() => {
    const card = document.getElementById('post-job-card');
    if (card) {
      setTimeout(() => {
        card.classList.add('loaded');
      }, 100);
    }
  }, []);

  return (
    <div className="postjob-container">
      <div
        id="post-job-card"
        className="postjob-card"
      >
        <div className="postjob-header">
          <h1 className="postjob-title">
            Post a New Job
          </h1>
          <p className="postjob-subtitle">
            Create a new job posting to attract qualified candidates
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Job Details Section */}
          <div className="postjob-section">
            <h2 className="postjob-section-title">Job Details</h2>
            <div className="postjob-form-grid">
              {/* Job Title */}
              <div className="postjob-form-group">
                <label className="postjob-label">
                  Job Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={`postjob-input ${errors.title ? 'error' : ''}`}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                />
                {errors.title && <div className="postjob-error">{errors.title}</div>}
              </div>
              
              {/* Location */}
              <div className="postjob-form-group">
                <label className="postjob-label">
                  Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={`postjob-input ${errors.location ? 'error' : ''}`}
                  placeholder="e.g., Addis Ababa, Bahir Dar"
                />
                {errors.location && <div className="postjob-error">{errors.location}</div>}
              </div>
              
              {/* Job Type */}
              <div className="postjob-form-group">
                <label className="postjob-label">
                  Job Type <span className="required">*</span>
                </label>
                <select
                  name="job_type"
                  value={form.job_type}
                  onChange={handleChange}
                  className={`postjob-input ${errors.job_type ? 'error' : ''}`}
                >
                  <option value="">Select job type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
                {errors.job_type && <div className="postjob-error">{errors.job_type}</div>}
              </div>
              
              {/* Experience Level */}
              <div className="postjob-form-group">
                <label className="postjob-label">
                  Experience Level <span className="required">*</span>
                </label>
                <select
                  name="experience_level"
                  value={form.experience_level}
                  onChange={handleChange}
                  className={`postjob-input ${errors.experience_level ? 'error' : ''}`}
                >
                  <option value="">Select experience level</option>
                  <option value="Entry">Entry Level (0-2 years)</option>
                  <option value="Mid">Mid Level (3-5 years)</option>
                  <option value="Senior">Senior Level (6-10 years)</option>
                  <option value="Executive">Executive Level (10+ years)</option>
                </select>
                {errors.experience_level && <div className="postjob-error">{errors.experience_level}</div>}
              </div>
              
              {/* Salary Range */}
              <div className="postjob-form-group">
                <label className="postjob-label">Salary Range or Status</label>
                <input
                  type="text"
                  name="salary_range"
                  value={form.salary_range}
                  onChange={handleChange}
                  className="postjob-input"
                  placeholder="e.g., 15,000 - 25,000 ETB, Negotiable, To be discussed, Not specified"
                />
              </div>
              
              {/* Application Deadline */}
              <div className="postjob-form-group">
                <label className="postjob-label">Application Deadline</label>
                <input
                  type="date"
                  name="application_deadline"
                  value={form.application_deadline}
                  onChange={handleChange}
                  className="postjob-input"
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="postjob-section">
            <h2 className="postjob-section-title">Description</h2>
            <div className="postjob-form-group full-width">
              <label className="postjob-label">
                Job Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className={`postjob-input postjob-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              />
              {errors.description && <div className="postjob-error">{errors.description}</div>}
            </div>
          </div>

          {/* Requirements Section */}
          <div className="postjob-section">
            <h2 className="postjob-section-title">Requirements</h2>
            <div className="postjob-form-group full-width">
              <label className="postjob-label">
                Job Requirements <span className="required">*</span>
              </label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={5}
                className={`postjob-input postjob-textarea ${errors.requirements ? 'error' : ''}`}
                placeholder="List the required skills, qualifications, and experience..."
              />
              {errors.requirements && <div className="postjob-error">{errors.requirements}</div>}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="postjob-section">
            <h2 className="postjob-section-title">Benefits & Perks</h2>
            <div className="postjob-form-group full-width">
              <label className="postjob-label">Benefits</label>
              <textarea
                name="benefits"
                value={form.benefits}
                onChange={handleChange}
                rows={3}
                className="postjob-input postjob-textarea"
                placeholder="List the benefits and perks offered (health insurance, flexible hours, etc.)..."
              />
            </div>
          </div>

          {errors.api && (
            <div className="postjob-api-error">
              {errors.api}
            </div>
          )}

          <div className="postjob-buttons">
            <button
              type="submit"
              disabled={loading}
              className="postjob-btn-primary"
            >
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="postjob-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal for Feedback */}
      {showModal && (
        <div className="postjob-modal-overlay">
          <div className="postjob-modal">
            {/* Icon */}
            <div className={`postjob-modal-icon ${modalType}`}>
              {modalType === 'success' && '✅'}
              {modalType === 'info' && 'ℹ️'}
              {modalType === 'error' && '❌'}
            </div>
            <h2 className={`postjob-modal-title ${modalType}`}>
              {modalType === 'success' && 'Success'}
              {modalType === 'info' && 'Info'}
              {modalType === 'error' && 'Error'}
            </h2>
            <p className="postjob-modal-message">
              {modalMessage}
            </p>
            <div className="postjob-modal-buttons">
              <button
                onClick={() => {
                  setShowModal(false);
                  if (modalType === 'success') navigate('/employer/dashboard');
                }}
                className={`postjob-modal-btn ${modalType}`}
              >
                {modalType === 'success' ? 'Go to Dashboard' : 'Close'}
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="postjob-modal-close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob; 