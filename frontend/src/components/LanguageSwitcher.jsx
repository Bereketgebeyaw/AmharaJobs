import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'am', name: 'አማርኛ', nativeName: 'Amharic' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: '1px solid #fff',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          minWidth: '120px',
          justifyContent: 'space-between'
        }}
        aria-label={t('language.switch')}
      >
        <span>{currentLang?.nativeName}</span>
        <span style={{ fontSize: '0.8rem' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            minWidth: '120px',
            marginTop: '0.25rem'
          }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: currentLanguage === language.code ? '#f0f0f0' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: currentLanguage === language.code ? 'var(--primary)' : '#333',
                fontWeight: currentLanguage === language.code ? '600' : '400',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = currentLanguage === language.code ? '#f0f0f0' : '#f8f8f8';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = currentLanguage === language.code ? '#f0f0f0' : 'transparent';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {language.code === 'en' ? '🇺🇸' : '🇪🇹'}
              </span>
              <span>{language.nativeName}</span>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher; 