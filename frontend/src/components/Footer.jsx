import React from 'react'

const Footer = () => (
  <footer aria-label="Site footer" style={{ background: '#f5f5f5', color: '#333', padding: '1.5rem 0', textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
    <div style={{ fontSize: '1rem' }}>&copy; {new Date().getFullYear()} AmharaJobs. All rights reserved.</div>
    <div style={{ fontSize: '0.95rem', marginTop: 8 }}>
      <a href="mailto:info@amharajobs.com" style={{ color: '#1976d2', textDecoration: 'none' }}>Contact Us</a>
    </div>
  </footer>
)

export default Footer 