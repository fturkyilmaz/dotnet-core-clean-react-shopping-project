import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Suspense, lazy } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './i18n/config'; // Initialize i18n

import { store } from '@store';
import { queryClient } from '@api/queryClient';
import Header from '@components/Header';
import ProtectedRoute from '@components/ProtectedRoute';
import ErrorBoundary from '@components/ErrorBoundary';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@pages/HomePage'));
const CartsPage = lazy(() => import('@pages/CartsPage'));
const Category = lazy(() => import('@pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('@pages/ProductDetailPage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const RegisterPage = lazy(() => import('@pages/RegisterPage'));
const AdminDashboard = lazy(() => import('@pages/AdminDashboard'));
const AddProductPage = lazy(() => import('@pages/AddProductPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center">
    <div className="spinner-border text-primary spinner-border-custom" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <Header />
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
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <ToastContainer position="top-right" autoClose={3000} />
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
