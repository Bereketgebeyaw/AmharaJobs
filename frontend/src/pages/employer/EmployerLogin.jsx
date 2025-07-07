import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EmployerLogin = () => {
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
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        const data = await response.json();
        if (response.ok) {
          // Check if user is an employer
          if (data.user.user_type === 'employer') {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/employer/dashboard');
          } else {
            setErrors({ api: 'This login is for employers only. Please use the job seeker login.' });
          }
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e6f4ea 0%, #fff 100%)' }}>
      {/* Employer Portal Navbar */}
      <nav
        style={{
          background: 'var(--primary)',
          color: '#fff',
          padding: '1rem 2rem',
          boxShadow: '0 2px 8px #e3e3e3',
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          width: '100vw',
          margin: 0,
          zIndex: 100
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          <Link
            to="/employer"
            style={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#fff',
              textDecoration: 'none',
              letterSpacing: 1
            }}
          >
            AmharaJobs - Employer Portal
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link 
              to="/employer/register" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #fff'
              }}
            >
              Sign Up
            </Link>
            <Link 
              to="/" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              Are you a Job Seeker?
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '3rem', 
          borderRadius: '12px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 450
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              color: 'var(--primary)', 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}>
              Welcome Back
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Sign in to your employer account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Company Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: errors.email ? '1px solid #f44336' : '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your company email"
              />
              {errors.email && (
                <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: errors.password ? '1px solid #f44336' : '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
              />
              {errors.password && (
                <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {errors.api && (
              <div style={{ 
                color: '#f44336', 
                background: '#ffebee', 
                padding: '0.75rem', 
                borderRadius: '6px', 
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}>
                {errors.api}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.875rem',
                borderRadius: '6px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: '1.5rem'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ color: '#666' }}>Don't have an account? </span>
              <Link 
                to="/employer/register" 
                style={{ 
                  color: 'var(--primary)', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign up here
              </Link>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link 
                to="/" 
                style={{ 
                  color: '#666', 
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                ← Back to Job Seeker Portal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin; 