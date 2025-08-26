import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/amharajobs',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Telegram',
      url: 'https://t.me/amharajobs',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/amharajobs',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    }
  ]

  const quickLinks = [
    { name: t('footer.about'), url: '/about' },
    { name: t('footer.contact'), url: '/contact' },
    { name: t('footer.privacy'), url: '/privacy' },
    { name: t('footer.terms'), url: '/terms' }
  ]

  return (
    <footer 
      aria-label="Site footer" 
      style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: '#fff',
        padding: '3rem 0 2rem 0',
        marginTop: '3rem',
        borderTop: '1px solid var(--primary-light)'
      }}
    >
      <div className="footer-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        {/* Main Footer Content */}
        <div className="footer-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          
          {/* Company Info */}
          <div>
            <h3 className="footer-title" style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              marginBottom: '1rem',
              color: '#fff'
            }}>
              AmharaJobs
            </h3>
            <p className="footer-subtitle" style={{ 
              fontSize: '1rem', 
              lineHeight: 1.6,
              opacity: 0.9,
              marginBottom: '1.5rem'
            }}>
              {t('footer.description')}
            </p>
            
            {/* Social Media Links */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,119,47,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 4px 12px rgba(0,119,47,0.4)'
                    e.target.style.background = 'var(--primary-dark)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 2px 8px rgba(0,119,47,0.3)'
                    e.target.style.background = 'var(--primary)'
                  }}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              color: '#fff'
            }}>
              {t('footer.quickLinks')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {quickLinks.map((link) => (
                <li key={link.name} style={{ marginBottom: '0.5rem' }}>
                  <a
                    href={link.url}
                    style={{
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      opacity: 0.9,
                      transition: 'opacity 0.2s ease',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                    onMouseLeave={(e) => e.target.style.opacity = '0.9'}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              color: '#fff'
            }}>
              {t('footer.contactInfo')}
            </h4>
            <div style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.9 }}>
              <p style={{ marginBottom: '0.5rem' }}>
                📧 {t('footer.email')}: info@amharajobs.com
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                📞 {t('footer.phone')}: +251 911 123 456
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                📍 {t('footer.address')}: Bahir Dar, Amhara Region, Ethiopia
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              color: '#fff'
            }}>
              {t('footer.newsletter')}
            </h4>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: 1.6,
              opacity: 0.9,
              marginBottom: '1rem'
            }}>
              {t('footer.newsletterDesc')}
            </p>
            <div className="footer-newsletter" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button
                style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'background 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--primary-dark)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--primary)'}
              >
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '2rem',
          textAlign: 'center'
        }}>
          <div className="footer-bottom" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>
              © {new Date().getFullYear()} AmharaJobs. {t('footer.allRightsReserved')}
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
              <span>{t('footer.madeWith')} ❤️ {t('footer.inEthiopia')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .footer-container {
            padding: 0 1rem !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .footer-newsletter {
            flex-direction: column !important;
          }
          .footer-newsletter input {
            min-width: 100% !important;
            margin-bottom: 0.5rem !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
            gap: 1rem !important;
          }
        }
        @media (max-width: 480px) {
          .footer-container {
            padding: 0 0.5rem !important;
          }
          .footer-title {
            font-size: 1.2rem !important;
          }
          .footer-subtitle {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer 