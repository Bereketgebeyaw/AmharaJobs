import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../assets/AmharaJlogo.png'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSuccess('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        const data = await res.json()
        if (res.ok) {
          setSuccess('Login successful!')
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('userId', data.user.id)
          
          // Navigate based on user type
          if (data.user.user_type === 'employer') {
            navigate('/employer/dashboard')
          } else {
            // Dispatch a custom event to notify navbar of login
            window.dispatchEvent(new CustomEvent('userLogin', { detail: data.user }))
            navigate('/') // For jobseekers, navigate to home page
          }
        } else {
          setErrors({ api: data.error || 'Login failed.' })
        }
      } catch (err) {
        setErrors({ api: 'Network error. Please try again.' })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 450, 
        background: '#fff', 
        borderRadius: '20px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #2e7d32 100%)',
          color: '#fff',
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <img src={logo} alt="AmharaJobs Logo" style={{ height: 50, marginRight: 12 }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>AmharaJobs</h1>
          </div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 0.5rem 0',
            opacity: 0.95
          }}>
            Welcome Back!
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            margin: 0, 
            opacity: 0.8,
            fontWeight: '400'
          }}>
            Sign in to access your account and find your dream job
          </p>
        </div>

        {/* Form Section */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#333', 
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>
                📧 Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1rem 1rem 3rem', 
                    borderRadius: '12px', 
                    border: errors.email ? '2px solid #f44336' : '2px solid #e1e5e9',
                    fontSize: '1rem',
                    background: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = '#fff'
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,115,47,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.background = '#f8f9fa'
                    e.target.style.borderColor = errors.email ? '#f44336' : '#e1e5e9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  color: '#666'
                }}>
                  📧
                </div>
              </div>
              {errors.email && (
                <div style={{ 
                  color: '#f44336', 
                  fontSize: '0.85rem', 
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ⚠️ {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#333', 
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>
                🔒 Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1rem 1rem 3rem', 
                    borderRadius: '12px', 
                    border: errors.password ? '2px solid #f44336' : '2px solid #e1e5e9',
                    fontSize: '1rem',
                    background: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = '#fff'
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,115,47,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.background = '#f8f9fa'
                    e.target.style.borderColor = errors.password ? '#f44336' : '#e1e5e9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  color: '#666'
                }}>
                  🔒
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '0.25rem'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <div style={{ 
                  color: '#f44336', 
                  fontSize: '0.85rem', 
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ⚠️ {errors.password}
                </div>
              )}
            </div>

            {/* Error Messages */}
            {errors.api && (
              <div style={{ 
                background: '#ffebee', 
                color: '#c62828', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                border: '1px solid #ffcdd2',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ❌ {errors.api}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div style={{ 
                background: '#e8f5e8', 
                color: '#2e7d32', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                border: '1px solid #c8e6c9',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ✅ {success}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: loading ? '#ccc' : 'linear-gradient(135deg, var(--primary) 0%, #2e7d32 100%)',
                color: '#fff', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(0,115,47,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(0,115,47,0.4)'
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(0,115,47,0.3)'
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Signing In...
                </div>
              ) : (
                '🚀 Sign In'
              )}
            </button>

            {/* Divider */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              margin: '2rem 0',
              color: '#666'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e1e5e9' }}></div>
              <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#e1e5e9' }}></div>
            </div>

            {/* Register Link */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>
                Don't have an account?
              </p>
              <Link
                to="/register"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  background: 'transparent',
                  color: 'var(--primary)',
                  border: '2px solid var(--primary)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--primary)'
                  e.target.style.color = '#fff'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = 'var(--primary)'
                }}
              >
                📝 Create Account
              </Link>
            </div>

            {/* Employer Link */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                Are you an employer?
              </p>
              <Link
                to="/employer/login"
                style={{
                  color: '#2196f3',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#1976d2'}
                onMouseOut={(e) => e.target.style.color = '#2196f3'}
              >
                🏢 Sign in to Employer Portal
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  )
}

export default Login 