import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav
      aria-label="Main navigation"
      style={{
        background: 'var(--primary)',
        color: '#fff',
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
          to="/"
          style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#fff',
            textDecoration: 'none',
            letterSpacing: 1
          }}
        >
          AmharaJobs
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
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
              Register
            </Link>
          </li>
          <li>
            <button
              onClick={() => navigate('/employer/register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Are you an Employer or Recruiter?
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
