import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('You must be logged in as admin. Redirecting to login...');
      setTimeout(() => navigate('/admin/login'), 1500);
      setLoading(false);
      return;
    }
    try {
      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
        search,
        user_type: userType,
        status
      });
      const response = await fetch(`http://localhost:5000/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.total);
      } else {
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          setError('Session expired or unauthorized. Redirecting to login...');
          setTimeout(() => navigate('/admin/login'), 1500);
        } else {
          setError(data.error || 'Failed to load users');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, search, userType, status, refresh]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStatus)
      });
      if (response.ok) {
        setRefresh(r => !r);
      } else {
        alert('Failed to update user status');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setRefresh(r => !r);
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: '#222' }}>
        User Management
      </h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd', minWidth: 220 }}
        />
        <select
          value={userType}
          onChange={e => { setUserType(e.target.value); setPage(1); }}
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }}
        >
          <option value="">All Types</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }}
        >
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ background: '#f8f9fa', color: '#333', fontWeight: 600 }}>
              <th style={{ padding: '1rem' }}>#</th>
              <th style={{ padding: '1rem' }}>Full Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Verified</th>
              <th style={{ padding: '1rem' }}>Created</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No users found.</td></tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td style={{ padding: '1rem' }}>{user.fullname}</td>
                  <td style={{ padding: '1rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{user.user_type}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {user.is_verified ? (
                      <span style={{ color: '#4caf50', fontWeight: 600 }}>✔</span>
                    ) : (
                      <span style={{ color: '#f44336', fontWeight: 600 }}>✖</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.95rem', color: '#888' }}>{user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleStatusChange(user.id, { is_verified: !user.is_verified })}
                      style={{
                        background: user.is_verified ? '#f44336' : '#4caf50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {user.is_verified ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        background: '#ff9800',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: '1px solid #ddd', background: page === 1 ? '#eee' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        >
          Prev
        </button>
        <span style={{ fontWeight: 600 }}>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: '1px solid #ddd', background: page === totalPages ? '#eee' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsers; 