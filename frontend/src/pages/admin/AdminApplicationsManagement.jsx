import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AdminApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [page, status]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page,
        limit,
        status,
        applicant: search,
        job: search
      });
      const response = await fetch(`API_ENDPOINTS.ADMIN_APPLICATIONS?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setTotalPages(data.pagination?.total || 1);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const statusColors = {
    pending: '#ff9800',
    reviewed: '#2196f3',
    shortlisted: '#9c27b0',
    interviewed: '#ff5722',
    hired: 'var(--primary)',
    rejected: '#f44336',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1300, margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Applications Management</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by applicant or job title"
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
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interviewed">Interviewed</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer' }}>
          Search
        </button>
      </form>
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--primary)', padding: '2rem' }}>Loading applications...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ background: 'var(--primary)', color: '#fff' }}>
                <th style={{ padding: '1rem' }}>Job Title</th>
                <th style={{ padding: '1rem' }}>Applicant</th>
                <th style={{ padding: '1rem' }}>Employer</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No applications found.</td>
                </tr>
              ) : applications.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{app.job_title}</td>
                  <td style={{ padding: '1rem' }}>{app.applicant_name} <br /><span style={{ color: '#888', fontSize: 13 }}>{app.applicant_email}</span></td>
                  <td style={{ padding: '1rem' }}>{app.employer_name || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      background: statusColors[app.status] || '#ccc',
                      color: '#fff',
                      borderRadius: 12,
                      padding: '0.25rem 0.75rem',
                      fontSize: 14,
                      fontWeight: 500
                    }}>{app.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(app.applied_at).toLocaleDateString()}</td>
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

export default AdminApplicationsManagement; 