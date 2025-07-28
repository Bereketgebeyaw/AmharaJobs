import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import logo from '../assets/AmharaJlogo.png'
import './Navbar.css'

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
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="AmharaJobs Logo" className="navbar-logo" />
          AmharaJobs
        </Link>
        
        {/* Hamburger Icon for Mobile */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-hamburger-line" />
          <span className="navbar-hamburger-line" />
          <span className="navbar-hamburger-line" />
        </button>
        
        {/* Main Nav Links */}
        <ul
          id="navbar-menu"
          className={`navbar-menu ${menuOpen ? 'open' : ''}`}
        >
          <li className="navbar-menu-item">
            <Link to="/" className="navbar-link">
              {t('nav.home')}
            </Link>
          </li>
          <li className="navbar-menu-item">
            <Link to="/jobs" className="navbar-link">
              {t('nav.jobs')}
            </Link>
          </li>
          
          {user ? (
            // Logged in user menu
            <>
              {user.user_type === 'employer' ? (
                <li className="navbar-menu-item">
                  <Link to="/employer/dashboard" className="navbar-link navbar-link-small">
                    {t('nav.dashboard')}
                  </Link>
                </li>
              ) : (
                // Job seeker menu
                <>
                  <li className="navbar-menu-item">
                    <Link to="/profile" className="navbar-link navbar-link-small">
                      {t('nav.profile')}
                    </Link>
                  </li>
                  <li className="navbar-menu-item">
                    <Link to="/my-applications" className="navbar-link navbar-link-small">
                      {t('nav.applications')}
                    </Link>
                  </li>
                </>
              )}
              <li className="navbar-menu-item">
                <span className="navbar-welcome">
                  {t('nav.welcome', { name: user.fullname })}
                </span>
              </li>
              <li className="navbar-menu-item">
                <button
                  onClick={handleLogout}
                  className="navbar-button"
                >
                  {t('nav.logout')}
                </button>
              </li>
            </>
          ) : (
            // Not logged in menu
            <>
              <li className="navbar-menu-item">
                <Link to="/login" className="navbar-link navbar-link-small">
                  {t('nav.login')}
                </Link>
              </li>
              <li className="navbar-menu-item">
                <Link to="/register" className="navbar-link navbar-link-small">
                  {t('nav.register')}
                </Link>
              </li>
              <li className="navbar-menu-item">
                <button
                  onClick={() => navigate('/employer')}
                  className="navbar-button"
                >
                  Are you an Employer or Recruiter?
                </button>
              </li>
            </>
          )}
          
          {/* Language Switcher */}
          <li className="navbar-menu-item">
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
