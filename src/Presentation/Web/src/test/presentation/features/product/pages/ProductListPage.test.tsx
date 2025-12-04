import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import ProductListPage from '@/presentation/features/product/pages/ProductListPage';

vi.mock('@/presentation/features/product/hooks/useProducts', () => ({
  useProducts: () => ({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

describe('ProductListPage', () => {
  it('renders header with i18n title', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <ProductListPage />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();
  });
});


