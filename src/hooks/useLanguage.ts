import { useState, useEffect } from 'react';
import { Language } from '../types';

const languages: Language[] = [
  { code: 'ar', name: 'العربية', direction: 'rtl' },
  { code: 'en', name: 'English', direction: 'ltr' }
];

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find(lang => lang.code === (localStorage.getItem('language') || 'ar')) || languages[0]
  );

  useEffect(() => {
    localStorage.setItem('language', currentLanguage.code);
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => 
      prev.code === 'ar' ? languages[1] : languages[0]
    );
  };

  const t = (ar: string, en: string) => {
    return currentLanguage.code === 'ar' ? ar : en;
  };

  return {
    currentLanguage,
    setCurrentLanguage,
    toggleLanguage,
    t,
    isRTL: currentLanguage.direction === 'rtl'
  };
};