import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/AmharaJlogo.png';
import Footer from '../../components/Footer';
import ChatWidget from '../../components/ChatWidget';

const EmployerPortal = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/employer/packages')
      .then(res => res.json())
      .then(data => {
        setPackages(data.packages || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load pricing packages.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e6f4ea 0%, #fff 100%)' }}>
      {/* Employer Portal Navbar */}
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
              to="/employer/pricing" 
              style={{ 
                color: 'var(--primary)', 
                textDecoration: 'none', 
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid var(--primary)',
                background: '#fff',
                fontWeight: 500
              }}
            >
              Pricing
            </Link>
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

      {/* Hero Section */}
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 700,
          color: 'var(--primary)',
          marginBottom: '1.5rem',
          lineHeight: 1.2
        }}>
          Find the Perfect Talent for Your Company
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: '#333',
          marginBottom: '3rem',
          maxWidth: 800,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Connect with qualified professionals in the Amhara region. Post jobs, manage applications, and build your dream team.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/employer/register"
            style={{
              background: 'var(--primary)',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0,115,47,0.3)'
            }}
          >
            Get Started - Post Your First Job
          </Link>
          <Link 
            to="/employer/login"
            style={{
              background: 'transparent',
              color: 'var(--primary)',
              padding: '1rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: '600',
              border: '2px solid var(--primary)'
            }}
          >
            Already have an account? Login
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        padding: '4rem 2rem', 
        background: '#fff',
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#333',
          marginBottom: '3rem'
        }}>
          Why Choose AmharaJobs?
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '2rem',
              color: '#fff'
            }}>
              📝
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
              Easy Job Posting
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Create detailed job postings in minutes with our intuitive form. Reach thousands of qualified candidates instantly.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '2rem',
              color: '#fff'
            }}>
              👥
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
              Quality Candidates
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Access a pool of pre-screened, qualified professionals from the Amhara region and beyond.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '2rem',
              color: '#fff'
            }}>
              📊
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
              Application Management
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Track applications, manage candidate status, and streamline your hiring process with our dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ 
        padding: '4rem 2rem', 
        background: 'var(--primary)',
        color: '#fff'
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
            Trusted by Leading Companies
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem' 
          }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                500+
              </div>
              <div style={{ fontSize: '1.1rem' }}>Companies</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                10,000+
              </div>
              <div style={{ fontSize: '1.1rem' }}>Job Seekers</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                2,000+
              </div>
              <div style={{ fontSize: '1.1rem' }}>Jobs Posted</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                95%
              </div>
              <div style={{ fontSize: '1.1rem' }}>Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Packages Section */}
      <div style={{
        padding: '4rem 2rem',
        background: '#fff',
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#333',
          marginBottom: '3rem'
        }}>
          Employer Pricing Packages
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>Loading packages...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'red', fontSize: '1.2rem' }}>{error}</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {packages.map((pkg, idx) => (
              <div key={pkg.id} style={{
                border: '1.5px solid #e0e0e0',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(44, 62, 80, 0.08)',
                padding: '2rem 1.5rem',
                background: '#fafbfc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 420
              }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00732f', marginBottom: 8 }}>{pkg.name}</h3>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#222', marginBottom: 4 }}>{pkg.price.toLocaleString()} birr <span style={{ fontSize: '1rem', color: '#888', fontWeight: 400 }}>/ year</span></div>
                <div style={{ fontSize: '1.1rem', color: '#444', marginBottom: 12 }}>Job Post Limit: <b>{pkg.job_post_limit}</b></div>
                <div style={{ marginBottom: 16, color: '#666', fontSize: '1rem', textAlign: 'center' }}>{pkg.description}</div>
                <ul style={{ textAlign: 'left', color: '#333', fontSize: '1rem', marginBottom: 18, paddingLeft: 18 }}>
                  {Array.isArray(pkg.features)
                    ? pkg.features.map((f, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>✔️ {f}</li>
                      ))
                    : pkg.features && JSON.parse(pkg.features).map((f, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>✔️ {f}</li>
                      ))
                  }
                </ul>
                <button style={{
                  background: '#00732f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.7rem 2.2rem',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 'auto',
                  boxShadow: '0 2px 8px rgba(0,115,47,0.10)'
                }}>
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div style={{ 
        padding: '4rem 2rem', 
        background: '#f8f9fa',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>
            Ready to Find Your Next Great Hire?
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
            Join hundreds of companies already using AmharaJobs to find their perfect candidates.
          </p>
          <Link 
            to="/employer/register"
            style={{
              background: 'var(--primary)',
              color: '#fff',
              padding: '1rem 3rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: '600',
              display: 'inline-block'
            }}
          >
            Start Posting Jobs Today
          </Link>
        </div>
      </div>

      {/* Chat Widget for Employer Portal */}
      <ChatWidget />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EmployerPortal; 