import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import Footer from '../../components/Footer';
import ChatWidget from '../../components/ChatWidget';

const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [activePackages, setActivePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showMyPackages, setShowMyPackages] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Fetch packages
    fetch(API_ENDPOINTS.EMPLOYER_PACKAGES)
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

    // Fetch user's active packages if logged in
    if (token) {
      fetch(API_ENDPOINTS.EMPLOYER_MY_PACKAGES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch active packages');
      })
      .then(data => {
        setActivePackages(data.activePackages || []);
      })
      .catch(err => {
        console.log('Could not fetch active packages:', err.message);
      });
    }

    // Check for tx_ref in URL for payment verification
    const urlParams = new URLSearchParams(window.location.search);
    const txRef = urlParams.get('tx_ref');
    if (txRef && token) {
      fetch(API_ENDPOINTS.EMPLOYER_VERIFY_PAYMENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tx_ref: txRef })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setModalMessage('Payment successful! Your package has been activated.');
          setShowModal(true);
          // Refresh active packages
          window.location.reload();
        } else {
          setModalMessage(data.message || 'Payment verification failed.');
          setShowModal(true);
        }
      })
      .catch(err => {
        setModalMessage('Failed to verify payment.');
        setShowModal(true);
      });
    }
  }, []);

  // Check if user has a specific package active
  const hasActivePackage = (packageId) => {
    return activePackages.some(pkg => pkg.package_id === packageId);
  };

  // Get active package info
  const getActivePackageInfo = (packageId) => {
    return activePackages.find(pkg => pkg.package_id === packageId);
  };

  // Show modal with message
  const showMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

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

  const activeButtonStyle = {
    ...buttonStyle,
    background: '#00732f',
    color: '#fff',
    cursor: 'default',
  };

  // Handle Chapa payment
  const handleBuyNow = async (packageId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('You must be logged in as an employer to purchase a package.');
      return;
    }

    // Check if already has this package
    if (hasActivePackage(packageId)) {
      const activePkg = getActivePackageInfo(packageId);
      showMessage(`You already have an active subscription for this package. Your current subscription is active until ${new Date(activePkg.end_date || activePkg.start_date).toLocaleDateString()}.`);
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.EMPLOYER_PAY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ package_id: packageId })
      });
      const data = await res.json();
      
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        // Handle specific error for already purchased package
        if (data.error && data.error.includes('already have an active subscription')) {
          showMessage(data.message || data.error);
        } else {
          showMessage(data.error || 'Failed to initiate payment.');
        }
      }
    } catch (err) {
      showMessage('Network error. Please try again.');
    }
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e6f4ea 0%, #f7f9fb 100%)', padding: '4rem 2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2.5rem',
          maxWidth: 1200,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h1 style={{ fontSize: '3rem', color: '#00732f', fontWeight: 900, letterSpacing: 1, margin: 0 }}>
            Employer Pricing Packages
          </h1>
          
          {isLoggedIn && (
            <button
              onClick={() => setShowMyPackages(true)}
              style={{
                background: '#00732f',
                color: '#fff',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,115,47,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              📦 My Packages
            </button>
          )}
        </div>
        
        {!isLoggedIn && (
          <div style={{ 
            textAlign: 'center', 
            background: '#fff3cd', 
            color: '#856404', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '2rem',
            border: '1px solid #ffeaa7'
          }}>
            <strong>Note:</strong> You need to be logged in as an employer to purchase packages.
          </div>
        )}

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
            {packages.map((pkg, idx) => {
              const isActive = hasActivePackage(pkg.id);
              const activePkgInfo = getActivePackageInfo(pkg.id);
              
              return (
                <div
                  key={pkg.id}
                  style={{ 
                    ...cardStyle,
                    border: isActive ? '2px solid #28a745' : cardStyle.border,
                    background: isActive ? '#f8fff9' : cardStyle.background
                  }}
                  onMouseEnter={e => !isActive && (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => !isActive && (e.currentTarget.style.transform = 'scale(1)')}
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

                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: 18,
                      left: 18,
                      background: '#28a745',
                      color: '#fff',
                      padding: '0.3rem 1rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      letterSpacing: 1
                    }}>
                      Active
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
                  
                  {isActive && activePkgInfo && (
                    <div style={{
                      background: '#e8f5e8',
                      border: '1px solid #28a745',
                      borderRadius: '8px',
                      padding: '0.8rem',
                      marginBottom: '1rem',
                      fontSize: '0.9rem',
                      color: '#155724',
                      textAlign: 'center'
                    }}>
                      <strong>Active until:</strong> {new Date(activePkgInfo.end_date || activePkgInfo.start_date).toLocaleDateString()}
                    </div>
                  )}

                  <ul style={{ textAlign: 'left', color: '#333', fontSize: '1.05rem', marginBottom: 22, paddingLeft: 22 }}>
                    {(Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features)).map((f, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>✔️ {f}</li>
                    ))}
                  </ul>
                  
                  <button
                    style={isActive ? activeButtonStyle : buttonStyle}
                    onClick={() => handleBuyNow(pkg.id)}
                    disabled={isActive}
                  >
                    {isActive ? 'Already Active' : 'Buy Now'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for messages */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ color: '#00732f', marginBottom: '1rem' }}>Package Information</h3>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: '#00732f',
                color: '#fff',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* My Packages Overlay */}
      {showMyPackages && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '2px solid #e8f5e8',
              paddingBottom: '1rem'
            }}>
              <h2 style={{ color: '#00732f', margin: 0, fontSize: '1.8rem' }}>My Active Packages</h2>
              <button
                onClick={() => setShowMyPackages(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                ×
              </button>
            </div>

            {activePackages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>You don't have any active packages yet.</p>
                <p>Browse our packages above to get started!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {activePackages.map((pkg, index) => (
                  <div key={pkg.id} style={{
                    border: '2px solid #28a745',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    background: '#f8fff9',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#28a745',
                      color: '#fff',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      ACTIVE
                    </div>

                    <h3 style={{ 
                      color: '#00732f', 
                      marginBottom: '1rem', 
                      fontSize: '1.4rem',
                      fontWeight: 700
                    }}>
                      {pkg.package_name}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                        <strong style={{ color: '#00732f' }}>Job Post Limit:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>
                          {pkg.job_post_limit} jobs
                        </div>
                      </div>
                      
                      <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                        <strong style={{ color: '#00732f' }}>Package Price:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>
                          {pkg.package_price?.toLocaleString()} ETB
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e0e0e0', marginBottom: '1rem' }}>
                      <strong style={{ color: '#00732f' }}>Description:</strong>
                      <div style={{ marginTop: '0.3rem', lineHeight: '1.5' }}>
                        {pkg.package_description}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                        <strong style={{ color: '#00732f' }}>Start Date:</strong>
                        <div style={{ marginTop: '0.3rem', fontWeight: 500 }}>
                          {new Date(pkg.start_date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                        <strong style={{ color: '#00732f' }}>Expires:</strong>
                        <div style={{ marginTop: '0.3rem', fontWeight: 500 }}>
                          {new Date(pkg.end_date || pkg.start_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '0.8rem', 
                      background: '#e8f5e8', 
                      borderRadius: '8px',
                      border: '1px solid #28a745',
                      fontSize: '0.9rem',
                      color: '#155724',
                      textAlign: 'center'
                    }}>
                      <strong>Transaction Reference:</strong> {pkg.tx_ref}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '1rem', 
              borderTop: '2px solid #e8f5e8',
              textAlign: 'center'
            }}>
              <button
                onClick={() => setShowMyPackages(false)}
                style={{
                  background: '#00732f',
                  color: '#fff',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0,115,47,0.2)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatWidget />
      <Footer />
    </>
  );
};

export default Pricing; 