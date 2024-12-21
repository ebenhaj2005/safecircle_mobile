import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Engels als fallback
    debug: true,
    interpolation: {
      escapeValue: false, // React maakt al gebruik van XSS bescherming
    },
    resources: {
      en: {
        translation: {
          "settings": "Settings",
          "language": "Language",
          "notifications": "Notifications",
          "back": "Back",
          "english": "English",
          "dutch": "Dutch",
          "french": "French",
          "spanish": "Spanish",
          "german": "German",
        },
      },
      nl: {
        translation: {
          "settings": "Instellingen",
          "language": "Taal",
          "notifications": "Meldingen",
          "back": "Terug",
          "english": "Engels",
          "dutch": "Nederlands",
          "french": "Frans",
          "spanish": "Spaans",
          "german": "Duits",
        },
      },
      fr: {
        translation: {
          "settings": "Paramètres",
          "language": "Langue",
          "notifications": "Notifications",
          "back": "Retour",
          "english": "Anglais",
          "dutch": "Néerlandais",
          "french": "Français",
          "spanish": "Espagnol",
          "german": "Allemand",
        },
      },
    },
  });

export default i18n;
