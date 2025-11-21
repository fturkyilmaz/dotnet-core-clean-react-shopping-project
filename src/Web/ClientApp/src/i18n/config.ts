import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      cart: 'Cart',
      checkout: 'Checkout',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      
      // Common
      search: 'Search',
      searchPlaceholder: 'Search products...',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      
      // Product
      price: 'Price',
      category: 'Category',
      rating: 'Rating',
      reviews: 'Reviews',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      
      // Cart
      cartEmpty: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      total: 'Total',
      quantity: 'Quantity',
      remove: 'Remove',
      clearCart: 'Clear Cart',
      
      // Auth
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      
      // Messages
      loginSuccess: 'Login successful!',
      loginFailed: 'Login failed',
      registerSuccess: 'Registration successful! Please login.',
      registerFailed: 'Registration failed',
      addedToCart: 'Added to cart!',
      removedFromCart: 'Removed from cart',
      
      // Settings
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      preferences: 'Preferences',
      currency: 'Currency',
      notifications: 'Notifications',
    },
  },
  tr: {
    translation: {
      // Navigation
      home: 'Ana Sayfa',
      products: 'Ürünler',
      categories: 'Kategoriler',
      cart: 'Sepet',
      checkout: 'Ödeme',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      logout: 'Çıkış Yap',
      
      // Common
      search: 'Ara',
      searchPlaceholder: 'Ürün ara...',
      addToCart: 'Sepete Ekle',
      viewDetails: 'Detayları Gör',
      loading: 'Yükleniyor...',
      error: 'Hata',
      success: 'Başarılı',
      cancel: 'İptal',
      save: 'Kaydet',
      delete: 'Sil',
      edit: 'Düzenle',
      
      // Product
      price: 'Fiyat',
      category: 'Kategori',
      rating: 'Değerlendirme',
      reviews: 'İncelemeler',
      inStock: 'Stokta Var',
      outOfStock: 'Stokta Yok',
      
      // Cart
      cartEmpty: 'Sepetiniz boş',
      continueShopping: 'Alışverişe Devam Et',
      subtotal: 'Ara Toplam',
      total: 'Toplam',
      quantity: 'Adet',
      remove: 'Kaldır',
      clearCart: 'Sepeti Temizle',
      
      // Auth
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifre Tekrar',
      signIn: 'Giriş Yap',
      signUp: 'Kayıt Ol',
      createAccount: 'Hesap Oluştur',
      alreadyHaveAccount: 'Zaten hesabınız var mı?',
      dontHaveAccount: 'Hesabınız yok mu?',
      
      // Messages
      loginSuccess: 'Giriş başarılı!',
      loginFailed: 'Giriş başarısız',
      registerSuccess: 'Kayıt başarılı! Lütfen giriş yapın.',
      registerFailed: 'Kayıt başarısız',
      addedToCart: 'Sepete eklendi!',
      removedFromCart: 'Sepetten kaldırıldı',
      
      // Settings
      settings: 'Ayarlar',
      language: 'Dil',
      theme: 'Tema',
      darkMode: 'Karanlık Mod',
      lightMode: 'Aydınlık Mod',
      preferences: 'Tercihler',
      currency: 'Para Birimi',
      notifications: 'Bildirimler',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('language') || 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
