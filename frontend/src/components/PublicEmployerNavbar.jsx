import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/AmharaJlogo.png';
import './Navbar.css';

const PublicEmployerNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #2e7d32 100%)', color: '#fff' }}>
      <div className="navbar-container">
        <Link to="/employer" className="navbar-brand" style={{ color: '#fff' }}>
          <img src={logo} alt="AmharaJobs Logo" className="navbar-logo" />
          AmharaJobs - Employer Portal
        </Link>
        
        {/* Hamburger Icon for Mobile */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="public-employer-navbar-menu"
          onClick={() => setMenuOpen((open) => !open)}
          style={{ color: '#fff' }}
        >
          <span className="navbar-hamburger-line" style={{ background: '#1a5f1a' }} />
          <span className="navbar-hamburger-line" style={{ background: '#1a5f1a' }} />
          <span className="navbar-hamburger-line" style={{ background: '#1a5f1a' }} />
        </button>
        
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`} id="public-employer-navbar-menu">
          <div className="navbar-menu-item">
            <Link 
              to="/employer/login" 
              className="navbar-button-outline"
            >
              Login
            </Link>
          </div>
          <div className="navbar-menu-item">
            <button
              onClick={() => navigate('/employer/register')}
              className="navbar-button-primary"
            >
              Sign Up
            </button>
          </div>
          <div className="navbar-menu-item">
            <Link 
              to="/" 
              className="navbar-button-secondary"
            >
              Are you a Job Seeker?
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicEmployerNavbar; 