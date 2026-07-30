import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { es } from "./locales/es";

const deviceLanguage = getLocales()[0]?.languageCode === "es" ? "es" : "en";

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },

  lng: deviceLanguage,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },

  compatibilityJSON: "v4",
});

export default i18n;
