import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        const response = await fetch('http://localhost:5000/api/employer/jobs', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });

        if (response.ok) {
          alert('Job posted successfully!');
          navigate('/employer/dashboard');
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

  return (
    <div style={{ padding: '1rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Post a New Job</h1>
        <p style={{ color: '#666' }}>Create a new job posting to attract qualified candidates</p>
      </div>

      <div style={{ 
        background: '#fff', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px #eee'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Job Title */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  border: errors.title ? '1px solid #f44336' : '1px solid #ddd',
                  fontSize: '1rem'
                }}
                placeholder="e.g., Software Engineer, Marketing Manager"
              />
              {errors.title && <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.title}</div>}
            </div>

            {/* Location */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  border: errors.location ? '1px solid #f44336' : '1px solid #ddd',
                  fontSize: '1rem'
                }}
                placeholder="e.g., Addis Ababa, Bahir Dar"
              />
              {errors.location && <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.location}</div>}
            </div>

            {/* Job Type */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Job Type *
              </label>
              <select
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  border: errors.job_type ? '1px solid #f44336' : '1px solid #ddd',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
              {errors.job_type && <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.job_type}</div>}
            </div>

            {/* Experience Level */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Experience Level *
              </label>
              <select
                name="experience_level"
                value={form.experience_level}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  border: errors.experience_level ? '1px solid #f44336' : '1px solid #ddd',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select experience level</option>
                <option value="Entry">Entry Level (0-2 years)</option>
                <option value="Mid">Mid Level (3-5 years)</option>
                <option value="Senior">Senior Level (6-10 years)</option>
                <option value="Executive">Executive Level (10+ years)</option>
              </select>
              {errors.experience_level && <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.experience_level}</div>}
            </div>

            {/* Salary Range */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Salary Range
              </label>
              <input
                type="text"
                name="salary_range"
                value={form.salary_range}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
                placeholder="e.g., 15,000 - 25,000 ETB"
              />
            </div>

            {/* Application Deadline */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Application Deadline
              </label>
              <input
                type="date"
                name="application_deadline"
                value={form.application_deadline}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {/* Job Description */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Job Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '4px', 
                border: errors.description ? '1px solid #f44336' : '1px solid #ddd',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
            />
            {errors.description && <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.description}</div>}
          </div>

          {/* Job Requirements */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Job Requirements *
            </label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={6}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '4px', 
                border: errors.requirements ? '1px solid #f44336' : '1px solid #ddd',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="List the required skills, qualifications, and experience..."
            />
            {errors.requirements && <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.requirements}</div>}
          </div>

          {/* Benefits */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Benefits & Perks
            </label>
            <textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              rows={4}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="List the benefits and perks offered (health insurance, flexible hours, etc.)..."
            />
          </div>

          {errors.api && (
            <div style={{ color: '#f44336', marginTop: '1rem', padding: '0.75rem', background: '#ffebee', borderRadius: '4px' }}>
              {errors.api}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.75rem 2rem',
                borderRadius: '4px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              style={{
                background: '#f5f5f5',
                color: '#333',
                padding: '0.75rem 2rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob; 