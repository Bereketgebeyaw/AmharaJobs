import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    return localStorage.getItem('language') || 'en';
  });

  const [translations, setTranslations] = useState({});

  // Load translations based on current language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../translations/${currentLanguage}.js`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if translation file not found
        const englishModule = await import('../translations/en.js');
        setTranslations(englishModule.default);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    // Update document direction for RTL languages if needed
    document.documentElement.dir = language === 'am' ? 'ltr' : 'ltr'; // Amharic uses LTR
    document.documentElement.lang = language;
  };

  const t = (key, params = {}) => {
    let translation = translations[key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 