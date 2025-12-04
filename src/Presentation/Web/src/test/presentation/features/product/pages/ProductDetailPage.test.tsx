import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import ProductDetailPage from '@/presentation/features/product/pages/ProductDetailPage';

// Mock useParams and useProduct hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('@/presentation/features/product/hooks/useProducts', () => ({
  useProduct: () => ({
    data: undefined,
    isLoading: false,
    isError: true,
  }),
}));

describe('ProductDetailPage', () => {
  it('shows error UI when product is not found', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <ProductDetailPage />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /continue shopping/i })
    ).toBeInTheDocument();
  });
});


