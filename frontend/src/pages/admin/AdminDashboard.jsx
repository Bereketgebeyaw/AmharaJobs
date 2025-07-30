import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/AmharaJlogo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Please login to access admin dashboard');
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.ADMIN_DASHBOARD, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load dashboard');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      reviewed: '#2196f3',
      shortlisted: '#9c27b0',
      interviewed: '#ff5722',
      hired: '#4caf50',
      rejected: '#f44336',
      active: '#4caf50',
      inactive: '#f44336',
      draft: '#ff9800'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8f9fa',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8f9fa',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: 'red', textAlign: 'center' }}>
          <div>{error}</div>
          <Link to="/admin/login" style={{ color: '#4ecdc4', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8f9fa',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>No data available</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Admin Navbar */}
      <nav style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '1rem 2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: 1400,
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="AmharaJobs Logo" style={{ height: 40, marginRight: 12 }} />
            <div>
              <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
                AmharaJobs Admin
              </h1>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                Administrative Dashboard
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/" style={{ 
              color: '#fff', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              View Site
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                color: '#fff',
                border: '1px solid #ff6b6b',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid #e9ecef',
          paddingBottom: '1rem'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'User Management', icon: '👥', link: '/admin/users' },
            { id: 'jobs', label: 'Job Management', icon: '💼', link: '/admin/jobs' },
            { id: 'applications', label: 'Applications', icon: '📝', link: '/admin/applications' },
            { id: 'reports', label: 'Reports', icon: '📈', link: '/admin/reports' }
          ].map(tab => (
            tab.link ? (
              <Link
                key={tab.id}
                to={tab.link}
                style={{
                  background: activeTab === tab.id ? '#4ecdc4' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#666',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
              >
                {tab.icon} {tab.label}
              </Link>
            ) : (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? '#4ecdc4' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#666',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            )
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Statistics Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem', 
              marginBottom: '2rem' 
            }}>
              <div style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #4ecdc4'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                      Total Users
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ecdc4' }}>
                      {dashboardData.stats.totalUsers}
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem' }}>👥</div>
                </div>
              </div>

              <div style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #45b7d1'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                      Active Jobs
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#45b7d1' }}>
                      {dashboardData.stats.activeJobs}
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem' }}>💼</div>
                </div>
              </div>

              <div style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #ff6b6b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                      Pending Applications
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                      {dashboardData.stats.pendingApplications}
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem' }}>📝</div>
                </div>
              </div>

              <div style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #ffd93d'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                      Total Applications
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffd93d' }}>
                      {dashboardData.stats.totalApplications}
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem' }}>📊</div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '2rem' 
            }}>
              {/* Recent Users */}
              <div style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#333' }}>Recent Users</h3>
                  <Link to="/admin/users" style={{ color: '#4ecdc4', textDecoration: 'none', fontSize: '0.9rem' }}>
                    View All
                  </Link>
                </div>
                {dashboardData.recentUsers.length === 0 ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No recent users</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dashboardData.recentUsers.slice(0, 5).map(user => (
                      <div key={user.id} style={{ 
                        padding: '1rem', 
                        border: '1px solid #f0f0f0', 
                        borderRadius: '8px',
                        background: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '1rem' }}>
                              {user.fullname}
                            </h4>
                            <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                              {user.email}
                            </p>
                            <span style={{ 
                              fontSize: '0.8rem', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '12px',
                              background: user.user_type === 'jobseeker' ? '#e8f5e8' : '#e3f2fd',
                              color: user.user_type === 'jobseeker' ? '#2e7d32' : '#1976d2'
                            }}>
                              {user.user_type}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Jobs */}
              <div style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#333' }}>Recent Jobs</h3>
                  <Link to="/admin/jobs" style={{ color: '#4ecdc4', textDecoration: 'none', fontSize: '0.9rem' }}>
                    View All
                  </Link>
                </div>
                {dashboardData.recentJobs.length === 0 ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No recent jobs</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dashboardData.recentJobs.slice(0, 5).map(job => (
                      <div key={job.id} style={{ 
                        padding: '1rem', 
                        border: '1px solid #f0f0f0', 
                        borderRadius: '8px',
                        background: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '1rem' }}>
                              {job.title}
                            </h4>
                            <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                              by {job.employer_name}
                            </p>
                            <span style={{ 
                              fontSize: '0.8rem', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '12px',
                              background: `${getStatusColor(job.status)}20`,
                              color: getStatusColor(job.status)
                            }}>
                              {job.status}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented here */}
        {activeTab !== 'overview' && (
          <div style={{ 
            background: '#fff', 
            padding: '2rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p style={{ color: '#666' }}>
              This feature is coming soon. The {activeTab} management interface will be implemented next.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 