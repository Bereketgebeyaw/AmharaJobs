import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/AmharaJlogo.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          navigate('/admin/dashboard');
        } else {
          setErrors({ api: data.error || 'Login failed.' });
        }
      } catch (err) {
        setErrors({ api: 'Network error. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '3rem',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)'
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <img src={logo} alt="AmharaJobs Logo" style={{ height: 60, marginRight: 12 }} />
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              margin: 0,
              color: '#1a1a1a',
              letterSpacing: 1
            }}>
              AmharaJobs
            </h1>
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            margin: '0 0 0.5rem 0',
            color: '#333'
          }}>
            Admin Portal
          </h2>
          <p style={{
            color: '#666',
            margin: 0,
            fontSize: '1rem'
          }}>
            Access the administrative dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          {errors.api && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #fcc',
              fontSize: '0.9rem'
            }}>
              {errors.api}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: errors.email ? '2px solid #ff6b6b' : '2px solid #e1e5e9',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4ecdc4'}
              onBlur={(e) => e.target.style.borderColor = errors.email ? '#ff6b6b' : '#e1e5e9'}
            />
            {errors.email && (
              <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: errors.password ? '2px solid #ff6b6b' : '2px solid #e1e5e9',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4ecdc4'}
              onBlur={(e) => e.target.style.borderColor = errors.password ? '#ff6b6b' : '#e1e5e9'}
            />
            {errors.password && (
              <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%)',
              color: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Signing In...' : 'Sign In to Admin Portal'}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: '#4ecdc4',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = '#45b7d1'}
            onMouseOut={(e) => e.target.style.color = '#4ecdc4'}
          >
            ← Back to Main Site
          </Link>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            🔒 Secure administrative access only
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 