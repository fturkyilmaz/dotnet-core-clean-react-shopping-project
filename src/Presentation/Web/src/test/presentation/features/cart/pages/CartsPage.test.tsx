import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import CartsPage from '@/presentation/features/cart/pages/CartsPage';

// Mock useCart hook
vi.mock('@/presentation/features/cart/hooks/useCart', () => ({
  useCart: () => ({
    cartItems: [],
    isLoading: false,
    updateCartItem: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn(),
    totalItems: 0,
    totalPrice: 0,
  }),
}));

describe('CartsPage', () => {
  it('renders empty cart state with i18n texts', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <CartsPage />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/sepetiniz boş/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /alışverişe başla/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /alışverişe devam et/i })
    ).toBeInTheDocument();
  });
});


