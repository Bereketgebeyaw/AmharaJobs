import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/AmharaJlogo.png'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  // Check for existing user data on initial load
  useEffect(() => {
    const checkUserData = () => {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (userData && token) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user data:', error)
          // Clear invalid data
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    checkUserData()
  }, []) // Run only on mount

  // Re-check when location changes (after login/logout)
  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [location])

  // Listen for login events
  useEffect(() => {
    const handleUserLogin = (event) => {
      setUser(event.detail)
    }

    window.addEventListener('userLogin', handleUserLogin)

    return () => {
      window.removeEventListener('userLogin', handleUserLogin)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    setUser(null)
    navigate('/')
  }

  return (
    <nav
      aria-label="Main navigation"
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
          to="/"
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
          
          {user ? (
            // Logged in user menu
            <>
              {user.user_type === 'employer' ? (
                <li>
                  <Link to="/employer/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
                    Dashboard
                  </Link>
                </li>
              ) : (
                // Job seeker menu
                <>
                  <li>
                    <Link to="/profile" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-applications" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
                      My Applications
                    </Link>
                  </li>
                </>
              )}
              <li>
                <span style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: 600 }}>
                  Welcome, {user.fullname}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #fff'
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Not logged in menu
            <>
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
                  onClick={() => navigate('/employer')}
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
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
