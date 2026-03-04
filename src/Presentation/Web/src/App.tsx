import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import './i18n/config'; // Initialize i18n
import './styles/globals.css'; // New design system styles

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './presentation/store';
import { queryClient } from '@/services/queryClient';
import { ThemeProvider } from '@/context/theme-provider';
import Header from '@/presentation/shared/components/Header';
import Footer from '@/presentation/shared/components/Footer';
import ProtectedRoute from '@/presentation/shared/components/ProtectedRoute';
import ErrorBoundary from '@/presentation/shared/components/ErrorBoundary';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/presentation/features/product/pages/HomePage'));
const CartsPage = lazy(() => import('@/presentation/features/cart/pages/CartsPage'));
const Category = lazy(() => import('@/presentation/features/product/pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('@/presentation/features/product/pages/ProductDetailPage'));
const LoginPage = lazy(() => import('@/presentation/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/presentation/features/auth/pages/RegisterPage'));
const AdminDashboard = lazy(() => import('@/presentation/features/admin/pages/AdminDashboard'));
const AddProductPage = lazy(() => import('@/presentation/features/admin/pages/AddProductPage'));
const AuditLogsPage = lazy(() => import('@/presentation/features/admin/pages/AuditLogsPage'));
const NotFoundPage = lazy(() => import('@/presentation/shared/pages/NotFoundPage'));

// Modern loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </motion.div>
  </div>
);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="furkan-store-theme">
            <BrowserRouter>
              <ErrorBoundary>
                <div className="min-h-screen bg-background flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/carts" element={<CartsPage />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/products/add" element={<ProtectedRoute requireAdmin><AddProductPage /></ProtectedRoute>} />
                        <Route path="/admin/audit-logs" element={<ProtectedRoute requireAdmin><AuditLogsPage /></ProtectedRoute>} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </ErrorBoundary>
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
