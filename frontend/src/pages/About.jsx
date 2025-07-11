import React from 'react';
import logo from '../assets/AmharaJlogo.png';

const team = [
  { name: 'Mekdes T.', role: 'Founder & CEO', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Samuel A.', role: 'Lead Developer', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Hanna B.', role: 'Community Manager', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Abel M.', role: 'Product Designer', img: 'https://randomuser.me/api/portraits/men/44.jpg' },
];

const valueIcons = [
  '💎', // Integrity
  '🚀', // Empowerment
  '💡', // Innovation
  '🤝', // Community
];

const About = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e6f4ea 0%, #f7f9fb 100%)', padding: 0 }}>
    {/* Hero Section */}
    <div style={{
      background: 'linear-gradient(135deg, var(--primary) 0%, #2e7d32 100%)',
      color: '#fff',
      padding: '4rem 1rem 2rem 1rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, letterSpacing: 1 }}>About AmharaJobs</h1>
      <p style={{ fontSize: '1.3rem', margin: '1.5rem auto 0 auto', maxWidth: 600, opacity: 0.95, fontWeight: 500 }}>
        Empowering the Amhara region with opportunity, technology, and community.
      </p>
      {/* Wavy SVG divider */}
      <svg viewBox="0 0 1440 120" style={{ display: 'block', width: '100%', height: 60, position: 'absolute', left: 0, bottom: -1, zIndex: 1 }}><path fill="#fff" fillOpacity="1" d="M0,64L48,74.7C96,85,192,107,288,117.3C384,128,480,128,576,112C672,96,768,64,864,53.3C960,43,1056,53,1152,69.3C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
    </div>

    {/* Main Card */}
    <div style={{ maxWidth: 950, margin: '-3rem auto 2rem auto', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: '2.5rem 2rem', position: 'relative', zIndex: 2 }}>
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Our Mission</h2>
        <p style={{ fontSize: '1.15rem', color: '#444', marginBottom: 0, lineHeight: 1.7 }}>
          To bridge the gap between opportunity and talent, fostering economic growth and career advancement in the Amhara region through technology and community.
        </p>
      </section>
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 18 }}>Our Values</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {['Integrity', 'Empowerment', 'Innovation', 'Community'].map((val, i) => (
            <div key={val} style={{ background: '#f7f9fb', borderRadius: 12, padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 2px 8px #e3e3e3', transition: 'transform 0.2s', fontWeight: 600 }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>{valueIcons[i]}</div>
              <div style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: 6 }}>{val}</div>
              <div style={{ fontSize: '1rem', color: '#555', fontWeight: 400 }}>
                {val === 'Integrity' && 'We operate with honesty and transparency in all we do.'}
                {val === 'Empowerment' && 'We empower job seekers and employers to reach their full potential.'}
                {val === 'Innovation' && 'We embrace technology to make job search and hiring easier.'}
                {val === 'Community' && 'We are committed to supporting the growth of our local community.'}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Our Story</h2>
        <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: 0, lineHeight: 1.7 }}>
          Founded by a passionate team of professionals from the Amhara region, AmharaJobs was created to address the unique challenges faced by job seekers and employers in our community. We saw the need for a platform that is not only easy to use, but also tailored to the local job market and culture.
        </p>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 18 }}>Meet the Team</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {team.map(member => (
            <div key={member.name} style={{ background: '#f7f9fb', borderRadius: 12, boxShadow: '0 2px 8px #e3e3e3', padding: '1.5rem 1rem', minWidth: 180, maxWidth: 200, textAlign: 'center', transition: 'transform 0.2s' }}>
              <img src={member.img} alt={member.name} style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, border: '3px solid var(--primary)' }} />
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem', marginBottom: 4 }}>{member.name}</div>
              <div style={{ color: '#555', fontSize: '0.98rem' }}>{member.role}</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Looking Ahead</h2>
        <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: 0, lineHeight: 1.7 }}>
          We are committed to continuous improvement and innovation. Thank you for being part of the AmharaJobs community!
        </p>
      </section>
    </div>
    <style>{`
      @media (max-width: 700px) {
        .about-card { padding: 1.2rem 0.5rem !important; }
        .about-team { flex-direction: column !important; gap: 1.2rem !important; }
      }
    `}</style>
  </div>
);

export default About; 