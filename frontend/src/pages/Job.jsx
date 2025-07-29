import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useParams, useNavigate } from 'react-router-dom';
import JobApplicationModal from '../components/JobApplicationModal';
import logo from '../assets/AmharaJlogo.png';

const Job = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`API_ENDPOINTS.JOBS/${id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
      } else {
        setError('Job not found or unavailable.');
      }
    } catch (err) {
      setError('Failed to load job details.');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#666', fontSize: '1.2rem' }}>Loading job details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#f44336', fontSize: '1.2rem', textAlign: 'center' }}>{error}</div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', position: 'relative' }}>
        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <img src={logo} alt="AmharaJobs Logo" style={{ height: 60 }} />
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{job.title}</h1>
            <div style={{ color: '#666', fontSize: '1.1rem', fontWeight: 500, marginTop: 4 }}>
              🏢 {job.company_name || 'Company Name'}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{
            padding: '0.375rem 0.875rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            background: `${getStatusColor(job.status)}15`,
            color: getStatusColor(job.status),
            border: `1px solid ${getStatusColor(job.status)}30`,
            letterSpacing: '0.5px',
            marginRight: '1rem'
          }}>
            {job.status}
          </span>
          <span style={{ color: '#999', fontSize: '0.9rem' }}>
            📅 Posted: {new Date(job.created_at).toLocaleDateString()}
          </span>
          {job.application_deadline && (
            <span style={{ color: '#ff9800', fontSize: '0.9rem', fontWeight: '500', marginLeft: 16 }}>
              ⏰ Deadline: {new Date(job.application_deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Job Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', borderRadius: '8px', padding: '0.75rem 1rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📍</span>
            <span style={{ color: '#555', fontSize: '1rem', fontWeight: '500' }}>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', borderRadius: '8px', padding: '0.75rem 1rem' }}>
            <span style={{ fontSize: '1.1rem' }}>💼</span>
            <span style={{ color: '#555', fontSize: '1rem', fontWeight: '500' }}>{job.job_type}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', borderRadius: '8px', padding: '0.75rem 1rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⏰</span>
            <span style={{ color: '#555', fontSize: '1rem', fontWeight: '500' }}>{job.experience_level}</span>
          </div>
          {job.salary_range && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', borderRadius: '8px', padding: '0.75rem 1rem' }}>
              <span style={{ fontSize: '1.1rem' }}>💰</span>
              <span style={{ color: '#555', fontSize: '1rem', fontWeight: '500' }}>{job.salary_range}</span>
            </div>
          )}
        </div>

        {/* Description & Requirements */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#333', fontWeight: 600, marginBottom: '0.75rem' }}>Job Description</h2>
          <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{job.description}</p>
          <h2 style={{ fontSize: '1.2rem', color: '#333', fontWeight: 600, marginBottom: '0.75rem' }}>Requirements</h2>
          <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.7 }}>{job.requirements}</p>
          {job.benefits && (
            <>
              <h2 style={{ fontSize: '1.2rem', color: '#333', fontWeight: 600, margin: '1.5rem 0 0.75rem 0' }}>Benefits</h2>
              <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.7 }}>{job.benefits}</p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowApplicationModal(true)}
            style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.9rem 2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 16px rgba(76, 175, 80, 0.3)';
            }}
            onMouseOut={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.2)';
            }}
          >
            🚀 Apply for this Job
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              color: 'var(--primary)',
              border: '2px solid var(--primary)',
              padding: '0.9rem 2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.target.style.background = 'var(--primary)';
              e.target.style.color = '#fff';
            }}
            onMouseOut={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--primary)';
            }}
          >
            ← Back
          </button>
        </div>

        {/* Application Modal */}
        {showApplicationModal && (
          <JobApplicationModal
            job={job}
            isOpen={showApplicationModal}
            onClose={() => setShowApplicationModal(false)}
            onSuccess={() => setShowApplicationModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Job; 