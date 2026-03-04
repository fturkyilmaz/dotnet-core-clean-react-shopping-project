import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';

import en from './en.json';
import tr from './tr.json';

const RESOURCES = {
  en: { translation: en },
  tr: { translation: tr },
};

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // Check if user has manually selected a language
      const savedLanguage = await SecureStore.getItemAsync('user-language');
      if (savedLanguage) {
        return callback(savedLanguage);
      }

      // Otherwise use device language
      const deviceLanguage = Localization.getLocales()[0].languageCode;
      return callback(deviceLanguage || 'en');
    } catch (error) {
      console.log('Error reading language', error);
      callback('en');
    }
  },
  init: () => { },
  cacheUserLanguage: async (language: string) => {
    try {
      await SecureStore.setItemAsync('user-language', language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
