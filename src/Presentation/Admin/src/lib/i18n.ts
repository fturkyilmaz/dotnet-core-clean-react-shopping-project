import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "tr"],
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          welcome: "Welcome to Shopping Admin",
          products: "Products",
          addProduct: "Add Product"
        }
      },
      tr: {
        translation: {
          welcome: "Alışveriş Admin Paneline Hoşgeldiniz",
          products: "Ürünler",
          addProduct: "Ürün Ekle"
        }
      }
    }
  });

export default i18n;
