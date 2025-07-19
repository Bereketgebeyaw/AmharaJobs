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

  // Animation for card fade-in
  React.useEffect(() => {
    const card = document.getElementById('post-job-card');
    if (card) {
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div
        id="post-job-card"
        style={{
          opacity: 0,
          transform: 'translateY(40px)',
          transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)',
          background: '#fff',
          padding: '3.5rem 3.5rem',
          borderRadius: '18px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
          maxWidth: 1100,
          width: '100%',
        }}
      >
        <h1 style={{
          color: 'var(--primary)',
          fontWeight: 700,
          fontSize: '2rem',
          marginBottom: '0.5rem',
          textAlign: 'center',
          letterSpacing: '0.5px',
        }}>
          Post a New Job
        </h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>
          Create a new job posting to attract qualified candidates
        </p>
        <form onSubmit={handleSubmit}>
          {/* Job Details Section */}
          <div style={{
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #eee',
          }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>Job Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
              {/* Job Title */}
              <div>
                <label className="postjob-label">Job Title <span style={{color:'#f44336'}}>*</span></label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="postjob-input"
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  style={{ border: errors.title ? '1.5px solid #f44336' : undefined }}
                />
                {errors.title && <div className="postjob-error">{errors.title}</div>}
              </div>
              {/* Location */}
              <div>
                <label className="postjob-label">Location <span style={{color:'#f44336'}}>*</span></label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="postjob-input"
                  placeholder="e.g., Addis Ababa, Bahir Dar"
                  style={{ border: errors.location ? '1.5px solid #f44336' : undefined }}
                />
                {errors.location && <div className="postjob-error">{errors.location}</div>}
              </div>
              {/* Job Type */}
              <div>
                <label className="postjob-label">Job Type <span style={{color:'#f44336'}}>*</span></label>
                <select
                  name="job_type"
                  value={form.job_type}
                  onChange={handleChange}
                  className="postjob-input"
                  style={{ border: errors.job_type ? '1.5px solid #f44336' : undefined }}
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
              <div>
                <label className="postjob-label">Experience Level <span style={{color:'#f44336'}}>*</span></label>
                <select
                  name="experience_level"
                  value={form.experience_level}
                  onChange={handleChange}
                  className="postjob-input"
                  style={{ border: errors.experience_level ? '1.5px solid #f44336' : undefined }}
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
              <div>
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
              <div>
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
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>Description</h2>
            <label className="postjob-label">Job Description <span style={{color:'#f44336'}}>*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="postjob-input"
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              style={{ border: errors.description ? '1.5px solid #f44336' : undefined }}
            />
            {errors.description && <div className="postjob-error">{errors.description}</div>}
          </div>

          {/* Requirements Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>Requirements</h2>
            <label className="postjob-label">Job Requirements <span style={{color:'#f44336'}}>*</span></label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={5}
              className="postjob-input"
              placeholder="List the required skills, qualifications, and experience..."
              style={{ border: errors.requirements ? '1.5px solid #f44336' : undefined }}
            />
            {errors.requirements && <div className="postjob-error">{errors.requirements}</div>}
          </div>

          {/* Benefits Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>Benefits & Perks</h2>
            <label className="postjob-label">Benefits</label>
            <textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              rows={3}
              className="postjob-input"
              placeholder="List the benefits and perks offered (health insurance, flexible hours, etc.)..."
            />
          </div>

          {errors.api && (
            <div style={{ color: '#f44336', marginTop: '1rem', padding: '0.75rem', background: '#ffebee', borderRadius: '4px', textAlign: 'center' }}>
              {errors.api}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={loading}
              className="postjob-btn-primary"
              style={{ opacity: loading ? 0.7 : 1 }}
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
      {/* Inline styles for custom classes */}
      <style>{`
        .postjob-label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 500;
          color: #222;
        }
        .postjob-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 6px;
          border: 1.5px solid #ddd;
          font-size: 1rem;
          background: #fafbfc;
          transition: border 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .postjob-input:focus {
          border: 1.5px solid var(--primary);
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.08);
        }
        .postjob-error {
          color: #f44336;
          font-size: 0.92rem;
          margin-top: 0.2rem;
        }
        .postjob-btn-primary {
          background: var(--primary);
          color: #fff;
          padding: 0.85rem 2.2rem;
          border-radius: 6px;
          border: none;
          font-size: 1.08rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px #eee;
          transition: background 0.2s, transform 0.15s;
        }
        .postjob-btn-primary:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-2px) scale(1.03);
        }
        .postjob-btn-secondary {
          background: #f5f5f5;
          color: #333;
          padding: 0.85rem 2.2rem;
          border-radius: 6px;
          border: 1.5px solid #ddd;
          font-size: 1.08rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .postjob-btn-secondary:hover {
          background: #e3e3e3;
          color: var(--primary);
        }
        @media (max-width: 1200px) {
          #post-job-card {
            padding: 1.5rem 0.7rem !important;
            max-width: 98vw !important;
          }
        }
        @media (max-width: 500px) {
          .postjob-btn-primary, .postjob-btn-secondary {
            width: 100%;
            padding: 0.85rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PostJob; 