import React, { useEffect, useState } from 'react';

const AdminJobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [tab, setTab] = useState('all');
  const [denyingJobId, setDenyingJobId] = useState(null);
  const [denialReason, setDenialReason] = useState('');

  useEffect(() => {
    // If tab is changed, update status filter accordingly
    if (tab === 'pending') {
      setStatus('pending');
    } else if (tab === 'all' && status === 'pending') {
      setStatus('');
    }
    fetchJobs();
    // eslint-disable-next-line
  }, [page, status, tab]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page,
        limit,
        search,
        status
      });
      const response = await fetch(`http://localhost:5000/api/admin/jobs?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        setTotalPages(data.pagination?.total || 1);
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
    if (newStatus === 'inactive') {
      setDenyingJobId(jobId);
      setDenialReason('');
      return;
    }
    if (!window.confirm(`Change job status to '${newStatus}'?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
      } else {
        alert('Failed to update job status');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleDenySubmit = async () => {
    if (!denialReason.trim()) {
      alert('Please provide a reason for denial.');
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/jobs/${denyingJobId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'inactive', denial_reason: denialReason })
      });
      if (response.ok) {
        setJobs(jobs.map(job => job.id === denyingJobId ? { ...job, status: 'inactive' } : job));
        setDenyingJobId(null);
        setDenialReason('');
      } else {
        alert('Failed to update job status');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/jobs/${jobId}`, {
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const statusColors = {
    active: 'var(--primary)',
    inactive: '#f44336',
    draft: '#ff9800',
    closed: '#888',
    pending: '#ffb300',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1300, margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Job Management</h1>
      {/* Tabs for All Jobs and Waiting for Approval */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => { setTab('all'); setPage(1); }}
          style={{
            background: tab === 'all' ? 'var(--primary)' : '#f5f5f5',
            color: tab === 'all' ? '#fff' : '#333',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem 2.2rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: tab === 'all' ? '0 2px 8px #eee' : 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          All Jobs
        </button>
        <button
          onClick={() => { setTab('pending'); setPage(1); }}
          style={{
            background: tab === 'pending' ? 'var(--primary)' : '#f5f5f5',
            color: tab === 'pending' ? '#fff' : '#333',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem 2.2rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: tab === 'pending' ? '0 2px 8px #eee' : 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          Waiting for Approval
        </button>
      </div>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search jobs by title, employer, etc."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #ccc', minWidth: 220 }}
        />
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer' }}>
          Search
        </button>
      </form>
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--primary)', padding: '2rem' }}>Loading jobs...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ background: 'var(--primary)', color: '#fff' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Employer</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Posted</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No jobs found.</td>
                </tr>
              ) : jobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{job.title}</td>
                  <td style={{ padding: '1rem' }}>{job.employer_name || job.employer_email || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      background: statusColors[job.status] || '#ccc',
                      color: '#fff',
                      borderRadius: 12,
                      padding: '0.25rem 0.75rem',
                      fontSize: 14,
                      fontWeight: 500
                    }}>{job.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(job.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {job.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(job.id, 'active')}
                          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(job.id, 'inactive')}
                          style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Deny
                        </button>
                      </>
                    ) : (
                      <>
                        <select
                          value={job.status}
                          onChange={e => handleStatusChange(job.id, e.target.value)}
                          style={{ padding: '0.25rem 0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 500, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.6 : 1 }}
        >
          Previous
        </button>
        <span style={{ fontWeight: 500 }}>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 500, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.6 : 1 }}
        >
          Next
        </button>
      </div>
      {/* Deny Reason Modal */}
      {denyingJobId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: '2rem', minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px #aaa' }}>
            <h2 style={{ color: '#f44336', marginBottom: 16 }}>Deny Job Posting</h2>
            <p style={{ marginBottom: 8 }}>Please provide a reason for denying this job. This will be sent to the employer.</p>
            <textarea
              value={denialReason}
              onChange={e => setDenialReason(e.target.value)}
              rows={4}
              style={{ width: '100%', borderRadius: 4, border: '1px solid #ccc', padding: 8, marginBottom: 16 }}
              placeholder="Reason for denial..."
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setDenyingJobId(null); setDenialReason(''); }}
                style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDenySubmit}
                style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Deny Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsManagement; 