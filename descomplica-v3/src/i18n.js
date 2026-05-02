import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en/translation.json';
import ptTranslations from './locales/pt/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: ptTranslations }
    },
    lng: 'pt', // Force PT as default
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
