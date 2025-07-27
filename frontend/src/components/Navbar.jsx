import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import logo from '../assets/AmharaJlogo.png'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, position: 'relative' }}>
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
        {/* Hamburger Icon for Mobile */}
        <button
          className="navbar-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            marginLeft: 8,
            zIndex: 201
          }}
        >
          <span style={{
            display: 'block',
            width: 28,
            height: 3,
            background: 'var(--primary)',
            borderRadius: 2,
            marginBottom: 6,
            transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(45deg) translateY(9px)' : 'none'
          }} />
          <span style={{
            display: 'block',
            width: 28,
            height: 3,
            background: 'var(--primary)',
            borderRadius: 2,
            marginBottom: 6,
            opacity: menuOpen ? 0 : 1,
            transition: 'all 0.3s'
          }} />
          <span style={{
            display: 'block',
            width: 28,
            height: 3,
            background: 'var(--primary)',
            borderRadius: 2,
            transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(-45deg) translateY(-9px)' : 'none'
          }} />
        </button>
        {/* Main Nav Links */}
        <ul
          id="navbar-menu"
          className={menuOpen ? 'navbar-menu open' : 'navbar-menu'}
          style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center',
            transition: 'all 0.3s',
          }}
        >
          <li>
            <Link to="/" style={{ color: '#111', textDecoration: 'none', fontSize: '1rem' }}>
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <Link to="/jobs" style={{ color: '#111', textDecoration: 'none', fontSize: '1rem' }}>
              {t('nav.jobs')}
            </Link>
          </li>
          
          {user ? (
            // Logged in user menu
            <>
              {user.user_type === 'employer' ? (
                <li>
                  <Link to="/employer/dashboard" style={{ color: '#111', textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {t('nav.dashboard')}
                  </Link>
                </li>
              ) : (
                // Job seeker menu
                <>
                  <li>
                    <Link to="/profile" style={{ color: '#111', textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {t('nav.profile')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-applications" style={{ color: '#111', textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {t('nav.applications')}
                    </Link>
                  </li>
                </>
              )}
              <li>
                <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {t('nav.welcome', { name: user.fullname })}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    color: '#111',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid var(--primary)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t('nav.logout')}
                </button>
              </li>
            </>
          ) : (
            // Not logged in menu
            <>
              <li>
                <Link to="/login" style={{ color: '#111', textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#111', textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  {t('nav.register')}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => navigate('/employer')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#111',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Are you an Employer or Recruiter?
                </button>
              </li>
            </>
          )}
          
          {/* Language Switcher */}
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
      {/* Responsive Navbar CSS */}
      <style>{`
        @media (max-width: 900px) {
          .navbar-hamburger {
            display: block !important;
          }
          .navbar-menu {
            position: fixed;
            top: 64px;
            right: 0;
            left: 0;
            background: #fff;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            width: 100vw;
            max-width: 100vw;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
            padding: 0.5rem 0 1.5rem 0;
            z-index: 200;
            transform: translateY(-120%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(.4,0,.2,1);
          }
          .navbar-menu.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
          .navbar-menu > li {
            width: 100%;
            padding: 0.7rem 2rem;
            border-bottom: 1px solid #f0f0f0;
            text-align: left;
          }
          .navbar-menu > li:last-child {
            border-bottom: none;
          }
        }
        @media (max-width: 600px) {
          .navbar-menu > li {
            padding: 0.7rem 1rem;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
