import React, { useState } from 'react'
import { Link } from 'react-router-dom'

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
  }

  const validate = () => {
    const errs = {}
    if (!form.company_name) errs.company_name = 'Company name is required'
    if (!form.company_type) errs.company_type = 'Company type is required'
    if (!form.contact_person) errs.contact_person = 'Contact person is required'
    if (!form.address) errs.address = 'Company address is required'
    if (!form.email) errs.email = 'Company email is required'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.phone) errs.phone = 'Company phone is required'
    if (!form.password) errs.password = 'Password is required'
    if (!form.confirm_password) errs.confirm_password = 'Please confirm your password'
    if (form.password && form.confirm_password && form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match'
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
        const res = await fetch('http://localhost:5000/api/auth/employer/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_name: form.company_name,
            company_type: form.company_type,
            contact_person: form.contact_person,
            address: form.address,
            email: form.email,
            phone: form.phone,
            password: form.password
          })
        })
        const data = await res.json()
        if (res.ok) {
          setSuccess('Registration successful! Please check your email and verify your account before logging in.')
        } else {
          setErrors({ api: data.error || 'Registration failed.' })
        }
      } catch (err) {
        setErrors({ api: 'Network error. Please try again.' })
      } finally {
        setLoading(false)
      }
    }
  }

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
              to="/employer/login" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #fff'
              }}
            >
              Login
              
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

      {/* Registration Form */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 500
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24, color: 'var(--primary)' }}>Employer Registration</h2>
                  {success ? (
            <div style={{ color: 'green', marginBottom: 12, textAlign: 'center' }}>{success}</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label>Company Name</label><br />
                <input type="text" name="company_name" value={form.company_name} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                {errors.company_name && <div style={{ color: 'red', fontSize: 13 }}>{errors.company_name}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Company Type</label><br />
                <select name="company_type" value={form.company_type} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="">Select type</option>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="NGO">NGO</option>
                  <option value="Other">Other</option>
                </select>
                {errors.company_type && <div style={{ color: 'red', fontSize: 13 }}>{errors.company_type}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Contact Person</label><br />
                <input type="text" name="contact_person" value={form.contact_person} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                {errors.contact_person && <div style={{ color: 'red', fontSize: 13 }}>{errors.contact_person}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Company Address</label><br />
                <input type="text" name="address" value={form.address} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} placeholder="Enter company address..." />
                {errors.address && <div style={{ color: 'red', fontSize: 13 }}>{errors.address}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Company Email</label><br />
                <input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                {errors.email && <div style={{ color: 'red', fontSize: 13 }}>{errors.email}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Company Phone</label><br />
                <input type="text" name="phone" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                {errors.phone && <div style={{ color: 'red', fontSize: 13 }}>{errors.phone}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Password</label><br />
                <input type="password" name="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                {errors.password && <div style={{ color: 'red', fontSize: 13 }}>{errors.password}</div>}
              </div>
              <div style={{ marginBottom: 24 }}>
                <label>Confirm Password</label><br />
                <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                {errors.confirm_password && <div style={{ color: 'red', fontSize: 13 }}>{errors.confirm_password}</div>}
              </div>
              {errors.api && <div style={{ color: 'red', marginBottom: 12 }}>{errors.api}</div>}
              <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, fontSize: '1rem' }} disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ color: '#666' }}>Already have an account? </span>
            <Link 
              to="/employer/login" 
              style={{ 
                color: 'var(--primary)', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerRegister 