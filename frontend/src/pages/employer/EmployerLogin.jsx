import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/AmharaJlogo.png';
import './EmployerAuth.css';

const EmployerLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
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
        const response = await fetch(API_ENDPOINTS.LOGIN, {
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
            localStorage.setItem('userId', data.user.id);
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
    <div className="employer-auth-container">
      <div className="employer-auth-card">
        {/* Header Section */}
        <div className="employer-auth-header">
          <div className="employer-auth-logo">
            <img src={logo} alt="AmharaJobs Logo" />
            <h1>AmharaJobs</h1>
          </div>
          <h2 className="employer-auth-title">
            Welcome Back, Employer!
          </h2>
          <p className="employer-auth-subtitle">
            Sign in to access your employer dashboard and manage your job postings
          </p>
        </div>

        {/* Form Section */}
        <div className="employer-auth-form">
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="employer-auth-form-group">
              <label className="employer-auth-label">
                📧 Company Email Address
              </label>
              <div className="employer-auth-input-wrapper">
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="Enter your company email address"
                  className={`employer-auth-input employer-auth-input-with-icon ${errors.email ? 'error' : ''}`}
                />
                <div className="employer-auth-input-icon">
                  📧
                </div>
              </div>
              {errors.email && (
                <div className="employer-auth-error">
                  ⚠️ {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="employer-auth-form-group">
              <label className="employer-auth-label">
                🔒 Password
              </label>
              <div className="employer-auth-input-wrapper">
                <input 
                  type="password" 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`employer-auth-input employer-auth-input-with-icon ${errors.password ? 'error' : ''}`}
                />
                <div className="employer-auth-input-icon">
                  🔒
                </div>
              </div>
              {errors.password && (
                <div className="employer-auth-error">
                  ⚠️ {errors.password}
                </div>
              )}
            </div>

            {/* API Error */}
            {errors.api && (
              <div className="employer-auth-api-error">
                ⚠️ {errors.api}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="employer-auth-button"
            >
              <div className="employer-auth-button-content">
                {loading ? (
                  <>
                    <div className="employer-auth-spinner"></div>
                    Signing In...
                  </>
                ) : (
                  '🚀 Sign In to Employer Portal'
                )}
              </div>
            </button>

            {/* Divider */}
            <div className="employer-auth-divider">
              <span>or</span>
            </div>

            {/* Register Link */}
            <div className="employer-auth-link-section">
              <p className="employer-auth-link-text">
                Don't have an employer account?
              </p>
              <Link
                to="/employer/register"
                className="employer-auth-link-button"
              >
                🏢 Register as Employer
              </Link>
            </div>

            {/* Job Seeker Link */}
            <div className="employer-auth-alt-link">
              <p className="employer-auth-alt-text">
                Are you a job seeker?
              </p>
              <Link to="/login">
                👤 Sign in to Job Seeker Portal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin; 