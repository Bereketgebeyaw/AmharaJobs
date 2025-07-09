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

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [page, status]);

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
    closed: '#888'
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1300, margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Job Management</h1>
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
    </div>
  );
};

export default AdminJobsManagement; 