import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/AmharaJlogo.png'

const EmployerRegister = () => {
  const [form, setForm] = useState({
    company_name: '',
    company_type: '',
    contact_person: '',
    address: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.company_name) newErrors.company_name = 'Company name is required'
    if (!form.company_type) newErrors.company_type = 'Company type is required'
    if (!form.contact_person) newErrors.contact_person = 'Contact person is required'
    if (!form.address) newErrors.address = 'Company address is required'
    if (!form.email) newErrors.email = 'Email is required'
    if (!form.phone) newErrors.phone = 'Phone number is required'
    if (!form.password) newErrors.password = 'Password is required'
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm_password) newErrors.confirm_password = 'Passwords do not match'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const response = await fetch('/api/auth/employer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! Please check your email to verify your account.')
        setForm({
          company_name: '',
          company_type: '',
          contact_person: '',
          address: '',
          email: '',
          phone: '',
          password: '',
          confirm_password: ''
        })
        setErrors({})
      } else {
        setErrors({ api: data.message || 'Registration failed' })
      }
    } catch (error) {
      setErrors({ api: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f7f9fb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 500, 
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
            Join as an Employer!
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            margin: 0, 
            opacity: 0.8,
            fontWeight: '400'
          }}>
            Create your employer account and start posting jobs to find the perfect talent
          </p>
        </div>

        {/* Form Section */}
        <div style={{ padding: '2rem' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2.5rem'
              }}>
                ✅
              </div>
              <h3 style={{ color: '#2e7d32', marginBottom: '1rem', fontSize: '1.3rem' }}>
                Registration Successful!
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {success}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Company Name Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#333', 
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  🏢 Company Name *
                </label>
                <input 
                  type="text" 
                  name="company_name" 
                  value={form.company_name} 
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: errors.company_name ? '2px solid #f44336' : '2px solid #e1e5e9',
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
                    e.target.style.borderColor = errors.company_name ? '#f44336' : '#e1e5e9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {errors.company_name && (
                  <div style={{ 
                    color: '#f44336', 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.company_name}
                  </div>
                )}
              </div>

              {/* Company Type Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#333', 
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  🏭 Company Type *
                </label>
                <select 
                  name="company_type" 
                  value={form.company_type} 
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: errors.company_type ? '2px solid #f44336' : '2px solid #e1e5e9',
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
                    e.target.style.borderColor = errors.company_type ? '#f44336' : '#e1e5e9'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="">Select company type</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Government">Government</option>
                  <option value="Non-Profit">Non-Profit</option>
                  <option value="Other">Other</option>
                </select>
                {errors.company_type && (
                  <div style={{ 
                    color: '#f44336', 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.company_type}
                  </div>
                )}
              </div>

              {/* Contact Person Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#333', 
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  👤 Contact Person *
                </label>
                <input 
                  type="text" 
                  name="contact_person" 
                  value={form.contact_person} 
                  onChange={handleChange}
                  placeholder="Enter contact person name"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: errors.contact_person ? '2px solid #f44336' : '2px solid #e1e5e9',
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
                    e.target.style.borderColor = errors.contact_person ? '#f44336' : '#e1e5e9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {errors.contact_person && (
                  <div style={{ 
                    color: '#f44336', 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.contact_person}
                  </div>
                )}
              </div>

              {/* Address Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#333', 
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  📍 Company Address *
                </label>
                <textarea 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange}
                  placeholder="Enter company address"
                  rows="3"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: errors.address ? '2px solid #f44336' : '2px solid #e1e5e9',
                    fontSize: '1rem',
                    background: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = '#fff'
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,115,47,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.background = '#f8f9fa'
                    e.target.style.borderColor = errors.address ? '#f44336' : '#e1e5e9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {errors.address && (
                  <div style={{ 
                    color: '#f44336', 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.address}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#333', 
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  📧 Company Email *
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="Enter company email address"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
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

              {/* Phone Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#333', 
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  📞 Company Phone *
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange}
                  placeholder="Enter company phone number"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: errors.phone ? '2px solid #f44336' : '2px solid #e1e5e9',
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
                    e.target.style.borderColor = errors.phone ? '#f44336' : '#e1e5e9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {errors.phone && (
                  <div style={{ 
                    color: '#f44336', 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.phone}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#333', 
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  🔒 Password *
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange}
                  placeholder="Enter password"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
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

              {/* Confirm Password Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#333', 
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  🔐 Confirm Password *
                </label>
                <input 
                  type="password" 
                  name="confirm_password" 
                  value={form.confirm_password} 
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: errors.confirm_password ? '2px solid #f44336' : '2px solid #e1e5e9',
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
                    e.target.style.borderColor = errors.confirm_password ? '#f44336' : '#e1e5e9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {errors.confirm_password && (
                  <div style={{ 
                    color: '#f44336', 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.confirm_password}
                  </div>
                )}
              </div>

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

              {/* API Error */}
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
                  ⚠️ {errors.api}
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
                    Creating Account...
                  </div>
                ) : (
                  '🚀 Create Employer Account'
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

              {/* Login Link */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#666', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>
                  Already have an employer account?
                </p>
                <Link
                  to="/employer/login"
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
                  🔑 Sign In
                </Link>
              </div>

              {/* Job Seeker Link */}
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  Are you a job seeker?
                </p>
                <Link
                  to="/register"
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
                  👤 Register as Job Seeker
                </Link>
              </div>
            </form>
          )}
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
    </div>
  )
}

export default EmployerRegister 