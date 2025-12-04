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
      description: 'Description',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      productNotFound: 'Product not found',
      buyNow: 'Buy Now',
      freeShippingTitle: 'Free Shipping',
      freeShippingSubtitle: 'Orders over $50',
      easyReturnsTitle: 'Easy Returns',
      easyReturnsSubtitle: '30 Days Return',
      
      // Cart
      cartEmpty: 'Your cart is empty',
      cartEmptyTitle: 'Your cart is empty',
      cartEmptySubtitle: 'You have not added any items to your cart yet. Start shopping to discover our great products!',
      startShopping: 'Start Shopping',
      browseCategories: 'Browse Categories',
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
      
      // Category
      selectCategory: 'Select a category to start shopping',
      viewAllProducts: 'View products from all categories',
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
      description: 'Açıklama',
      inStock: 'Stokta Var',
      outOfStock: 'Stokta Yok',
      productNotFound: 'Ürün bulunamadı',
      buyNow: 'Hemen Satın Al',
      freeShippingTitle: 'Ücretsiz Kargo',
      freeShippingSubtitle: '500₺ üzeri alışverişlerde',
      easyReturnsTitle: 'Kolay İade',
      easyReturnsSubtitle: '30 gün içinde iade',
      
      // Cart
      cartEmpty: 'Sepetiniz boş',
      cartEmptyTitle: 'Sepetiniz Boş',
      cartEmptySubtitle: 'Henüz sepetinize ürün eklemediniz. Harika ürünlerimizi keşfetmek için alışverişe başlayın!',
      startShopping: 'Alışverişe Başla',
      browseCategories: 'Kategorilere Göz At',
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
      
      // Category
      selectCategory: 'İlgilendiğiniz kategoriyi seçin ve alışverişe başlayın',
      viewAllProducts: 'Tüm kategorilerdeki ürünleri görüntüleyin',
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
