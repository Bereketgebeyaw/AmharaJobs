import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
          
          // Navigate based on user type
          if (data.user.user_type === 'employer') {
            navigate('/employer/dashboard')
          } else {
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
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <section style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: '2rem 1rem', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>Email</label><br />
            <input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
            {errors.email && <div style={{ color: 'red', fontSize: 13 }}>{errors.email}</div>}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>Password</label><br />
            <input type="password" name="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
            {errors.password && <div style={{ color: 'red', fontSize: 13 }}>{errors.password}</div>}
          </div>
          {errors.api && <div style={{ color: 'red', marginBottom: 12 }}>{errors.api}</div>}
          {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Login 