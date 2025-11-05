import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import translationRO from './locals/ro/translation.json';
import translationEN from './locals/en/translation.json';
import translationDE from './locals/de/translation.json';
import translationHU from './locals/hu/translation.json';
import translationES from './locals/es/translation.json';

const resources = {
  ro: {
    translation: translationRO
  },
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  },
  hu: {
    translation: translationHU
  },
  es: {
    translation: translationES
  }
};

// Get language from URL path or default to 'en'
const getLanguageFromPath = () => {
  const pathParts = window.location.pathname.split('/').filter(p => p);
  const supportedLanguages = ['ro', 'en', 'de', 'hu', 'es'];
  
  // Check if first part of path is a valid language code
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    return pathParts[0];
  }
  return 'en'; // default language
};

const initialLanguage = getLanguageFromPath();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;