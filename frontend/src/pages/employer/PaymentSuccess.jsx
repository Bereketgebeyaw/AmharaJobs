import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentSuccess = () => {
  const query = useQuery();
  const tx_ref = query.get('tx_ref');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    if (!tx_ref) {
      setStatus('error');
      setMessage('Missing payment information.');
      return;
    }
    fetch('http://localhost:5000/api/employer/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tx_ref })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setStatus('success');
          setMessage('Payment successful! Your package has been upgraded.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Failed to verify payment.');
      });
  }, [tx_ref]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: status === 'success' ? '#00732f' : '#c00' }}>
        {status === 'loading' ? 'Verifying Payment...' : status === 'success' ? 'Payment Success' : 'Payment Failed'}
      </h1>
      <p style={{ fontSize: '1.2rem', marginTop: 20 }}>{message}</p>
    </div>
  );
};

export default PaymentSuccess; 