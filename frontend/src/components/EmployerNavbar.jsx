import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/AmharaJlogo.png'
import './Navbar.css'

const EmployerNavbar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
    <nav className="navbar" aria-label="Employer navigation">
      <div className="navbar-container">
        <Link to="/employer/dashboard" className="navbar-brand">
          <img src={logo} alt="AmharaJobs Logo" className="navbar-logo" />
          AmharaJobs - Employer Portal
        </Link>
        
        {/* Hamburger Icon for Mobile */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="employer-navbar-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-hamburger-line" />
          <span className="navbar-hamburger-line" />
          <span className="navbar-hamburger-line" />
        </button>
        
        <ul
          id="employer-navbar-menu"
          className={`navbar-menu ${menuOpen ? 'open' : ''}`}
        >
          <li className="navbar-menu-item">
            <Link to="/employer/dashboard" className="navbar-link">
              Dashboard
            </Link>
          </li>
          <li className="navbar-menu-item">
            <Link to="/employer/post-job" className="navbar-link">
              Post Job
            </Link>
          </li>
          <li className="navbar-menu-item">
            <Link to="/employer/jobs" className="navbar-link">
              My Jobs
            </Link>
          </li>
          <li className="navbar-menu-item">
            <Link to="/employer/applications" className="navbar-link">
              Applications
            </Link>
          </li>
          <li className="navbar-menu-item">
            <Link to="/employer/pricing" className="navbar-link">
              Pricing
            </Link>
          </li>
          
          {user ? (
            <li className="navbar-menu-item">
              <button
                onClick={handleLogout}
                className="navbar-button"
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="navbar-menu-item">
              <Link to="/employer/login" className="navbar-link">
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