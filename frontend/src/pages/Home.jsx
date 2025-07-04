import React from 'react'

const Home = () => (
  <div
    style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e6f4ea 0%, #fff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 96,
      boxSizing: 'border-box',
      textAlign: 'center'
    }}
  >
    <h1 style={{
      fontSize: '3rem',
      fontWeight: 700,
      color: 'var(--primary)',
      marginBottom: 16,
      letterSpacing: 1,
      width: '100%',
      margin: 0
    }}>
      Welcome to AmharaJobs
    </h1>
    <p style={{
      fontSize: '1.35rem',
      color: '#333',
      marginBottom: 32,
      width: '100%',
      margin: 0
    }}>
      The leading job board for the Amhara region. Connect with top employers, discover new opportunities, and take the next step in your career journey.
    </p>
    <button style={{
      marginTop: 8,
      padding: '1.1rem 3rem',
      fontSize: '1.25rem',
      background: 'var(--primary)',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: 600,
      boxShadow: '0 2px 8px #e3e3e3'
    }}>
      Get Started
    </button>
  </div>
)

export default Home 