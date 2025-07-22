import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import ChatWidget from '../../components/ChatWidget';

const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/employer/packages')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setPackages(data.packages || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load pricing packages.');
        setLoading(false);
      });
  }, []);

  // Consistent card and button styles
  const cardStyle = {
    border: '1.5px solid #00732f',
    borderRadius: '20px',
    boxShadow: '0 4px 16px rgba(44, 62, 80, 0.10)',
    padding: '2.5rem 2rem',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 480,
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };
  const buttonStyle = {
    background: '#fff',
    color: '#00732f',
    border: '2px solid #00732f',
    borderRadius: '10px',
    padding: '0.9rem 2.5rem',
    fontSize: '1.15rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 'auto',
    boxShadow: '0 2px 8px rgba(0,115,47,0.10)',
    transition: 'background 0.2s, color 0.2s',
    outline: 'none',
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e6f4ea 0%, #f7f9fb 100%)', padding: '4rem 2rem' }}>
        <h1 style={{ textAlign: 'center', fontSize: '3rem', color: '#00732f', marginBottom: '2.5rem', fontWeight: 900, letterSpacing: 1 }}>
          Employer Pricing Packages
        </h1>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>Loading packages...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'red', fontSize: '1.2rem' }}>{error}</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              marginTop: '2rem',
              maxWidth: 1200,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                style={{ ...cardStyle }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {pkg.name === 'Pro Plan' && (
                  <div style={{
                    position: 'absolute',
                    top: 18,
                    right: 18,
                    background: '#00732f',
                    color: '#fff',
                    padding: '0.3rem 1rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    letterSpacing: 1
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00732f', marginBottom: 10 }}>{pkg.name}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#222', marginBottom: 6 }}>
                  {pkg.price.toLocaleString()} <span style={{ fontSize: '1.1rem', color: '#888', fontWeight: 400 }}>/ year</span>
                </div>
                <div style={{ fontSize: '1.15rem', color: '#444', marginBottom: 16 }}>
                  <b>Job Post Limit:</b> {pkg.job_post_limit}
                </div>
                <div style={{ marginBottom: 18, color: '#666', fontSize: '1.05rem', textAlign: 'center' }}>{pkg.description}</div>
                <ul style={{ textAlign: 'left', color: '#333', fontSize: '1.05rem', marginBottom: 22, paddingLeft: 22 }}>
                  {(Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features)).map((f, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>✔️ {f}</li>
                  ))}
                </ul>
                <button
                  style={buttonStyle}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#00732f';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = '#00732f';
                  }}
                  onFocus={e => {
                    e.currentTarget.style.background = '#00732f';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = '#00732f';
                  }}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ChatWidget />
      <Footer />
    </>
  );
};

export default Pricing; 