import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import ICU from 'i18next-icu';

i18n
  .use(ICU)
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // When translations are not available, fallback to this language
    fallbackLng: 'en-US',
    // When load a language, only load with its original name
    load: 'currentOnly',
    // Do not load any namespace by default, only load when translation functions are called
    ns: [],
    // Default namespace to use if not specified in translation functions
    defaultNS: 'translation',
    // Allow keys to have `:` and `.`
    nsSeparator: false,
    keySeparator: false,
    debug: IS_DEVELOPMENT,
    interpolation: {
      // React is already safe from XSS
      escapeValue: false,
    },
    backend: {
      // URL to load translations from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
