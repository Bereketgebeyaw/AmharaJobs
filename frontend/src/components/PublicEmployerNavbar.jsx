import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/AmharaJlogo.png';

const PublicEmployerNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        background: '#f7f9fb',
        color: 'var(--primary)',
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
          <button
            onClick={() => navigate('/employer/register')}
            style={{ 
              background: '#fff',
              color: 'var(--primary)', 
              textDecoration: 'none', 
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
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
  );
};

export default PublicEmployerNavbar; 