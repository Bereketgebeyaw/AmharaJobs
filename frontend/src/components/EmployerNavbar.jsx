import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/AmharaJlogo.png'

const EmployerNavbar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/employer')
  }

  return (
    <nav
      aria-label="Employer navigation"
      style={{
        background: '#f7f9fb',
        color: 'var(--primary)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        width: '100%',
        boxShadow: '0 2px 8px #e3e3e3',
        minHeight: 64,
        margin: 0,
        padding: 0
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
        <Link
          to="/employer/dashboard"
          style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: 'var(--primary)',
            textDecoration: 'none',
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img src={logo} alt="AmharaJobs Logo" style={{ height: 52, marginRight: 12 }} />
          AmharaJobs - Employer Portal
        </Link>
        <ul
          style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center'
          }}
        >
          <li>
            <Link to="/employer/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1rem' }}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/employer/post-job" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1rem' }}>
              Post Job
            </Link>
          </li>
          <li>
            <Link to="/employer/jobs" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1rem' }}>
              My Jobs
            </Link>
          </li>
          <li>
            <Link to="/employer/applications" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1rem' }}>
              Applications
            </Link>
          </li>
          
          {user ? (
            <>
              <li>
                <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>
                  Welcome, {user.company_name || user.fullname}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    color: 'var(--primary)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid var(--primary)'
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/employer/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1rem' }}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default EmployerNavbar 