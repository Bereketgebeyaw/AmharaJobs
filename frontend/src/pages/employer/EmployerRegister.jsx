import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/AmharaJlogo.png'
import { API_ENDPOINTS } from '../../config/api'
import './EmployerAuth.css'

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
      const response = await fetch(API_ENDPOINTS.EMPLOYER_REGISTER, {
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
    <div className="employer-auth-container">
      <div className="employer-auth-card">
        {/* Header Section */}
        <div className="employer-auth-header">
          <div className="employer-auth-logo">
            <img src={logo} alt="AmharaJobs Logo" />
            <h1>AmharaJobs</h1>
          </div>
          <h2 className="employer-auth-title">
            Join as an Employer!
          </h2>
          <p className="employer-auth-subtitle">
            Create your employer account and start posting jobs to find the perfect talent
          </p>
        </div>

        {/* Form Section */}
        <div className="employer-auth-form">
          {success ? (
            <div className="employer-auth-success-modal">
              <div className="employer-auth-success-icon">
                ✅
              </div>
              <h3 className="employer-auth-success-title">
                Registration Successful!
              </h3>
              <p className="employer-auth-success-message">
                {success}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Company Name Field */}
              <div className="employer-auth-form-group">
                <label className="employer-auth-label">
                  🏢 Company Name *
                </label>
                <input 
                  type="text" 
                  name="company_name" 
                  value={form.company_name} 
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className={`employer-auth-input ${errors.company_name ? 'error' : ''}`}
                />
                {errors.company_name && (
                  <div className="employer-auth-error">
                    ⚠️ {errors.company_name}
                  </div>
                )}
              </div>

              {/* Company Type Field */}
              <div className="employer-auth-form-group">
                <label className="employer-auth-label">
                  🏭 Company Type *
                </label>
                <select 
                  name="company_type" 
                  value={form.company_type} 
                  onChange={handleChange}
                  className={`employer-auth-select ${errors.company_type ? 'error' : ''}`}
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
                  <div className="employer-auth-error">
                    ⚠️ {errors.company_type}
                  </div>
                )}
              </div>

              {/* Contact Person Field */}
              <div className="employer-auth-form-group">
                <label className="employer-auth-label">
                  👤 Contact Person *
                </label>
                <input 
                  type="text" 
                  name="contact_person" 
                  value={form.contact_person} 
                  onChange={handleChange}
                  placeholder="Enter contact person name"
                  className={`employer-auth-input ${errors.contact_person ? 'error' : ''}`}
                />
                {errors.contact_person && (
                  <div className="employer-auth-error">
                    ⚠️ {errors.contact_person}
                  </div>
                )}
              </div>

              {/* Address Field */}
              <div className="employer-auth-form-group">
                <label className="employer-auth-label">
                  📍 Company Address *
                </label>
                <textarea 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange}
                  placeholder="Enter company address"
                  rows="3"
                  className={`employer-auth-textarea ${errors.address ? 'error' : ''}`}
                />
                {errors.address && (
                  <div className="employer-auth-error">
                    ⚠️ {errors.address}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="employer-auth-form-group">
                <label className="employer-auth-label">
                  📧 Company Email *
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="Enter company email address"
                  className={`employer-auth-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && (
                  <div className="employer-auth-error">
                    ⚠️ {errors.email}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div className="employer-auth-form-group">
                <label className="employer-auth-label">
                  📞 Company Phone *
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange}
                  placeholder="Enter company phone number"
                  className={`employer-auth-input ${errors.phone ? 'error' : ''}`}
                />
                {errors.phone && (
                  <div className="employer-auth-error">
                    ⚠️ {errors.phone}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="employer-auth-form-group">
                <label className="employer-auth-label">
                  🔒 Password *
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`employer-auth-input ${errors.password ? 'error' : ''}`}
                />
                {errors.password && (
                  <div className="employer-auth-error">
                    ⚠️ {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="employer-auth-form-group">
                <label className="employer-auth-label">
                  🔐 Confirm Password *
                </label>
                <input 
                  type="password" 
                  name="confirm_password" 
                  value={form.confirm_password} 
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`employer-auth-input ${errors.confirm_password ? 'error' : ''}`}
                />
                {errors.confirm_password && (
                  <div className="employer-auth-error">
                    ⚠️ {errors.confirm_password}
                  </div>
                )}
              </div>

              {/* Success Message */}
              {success && (
                <div className="employer-auth-success">
                  ✅ {success}
                </div>
              )}

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
                      Creating Account...
                    </>
                  ) : (
                    '🚀 Create Employer Account'
                  )}
                </div>
              </button>

              {/* Divider */}
              <div className="employer-auth-divider">
                <span>or</span>
              </div>

              {/* Login Link */}
              <div className="employer-auth-link-section">
                <p className="employer-auth-link-text">
                  Already have an employer account?
                </p>
                <Link
                  to="/employer/login"
                  className="employer-auth-link-button"
                >
                  🔑 Sign In
                </Link>
              </div>

              {/* Job Seeker Link */}
              <div className="employer-auth-alt-link">
                <p className="employer-auth-alt-text">
                  Are you a job seeker?
                </p>
                <Link to="/register">
                  👤 Register as Job Seeker
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployerRegister 