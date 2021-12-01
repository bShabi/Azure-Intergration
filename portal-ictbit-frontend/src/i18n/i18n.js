import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import deJSON from './translations/de';
import enJSON from './translations/en';
import esJSON from './translations/es';
import frJSON from './translations/fr';
import aeJSON from './translations/ae';
import zhJSON from './translations/zh';

const resources = {
  de: { translation: deJSON },
  en: { translation: enJSON },
  es: { translation: esJSON },
  fr: { translation: frJSON },
  ae: { translation: aeJSON },
  cn: { translation: zhJSON }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    keySeparator: false,
    fallbackLng: 'en',
    react: {
      useSuspense: true
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
