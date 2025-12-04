import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import CategoryPage from '@/presentation/features/product/pages/CategoryPage';

vi.mock('@/presentation/features/product/hooks/useProducts', () => ({
  useProducts: () => ({
    data: [
      { id: 1, title: 'P1', price: 10, description: '', category: 'electronics', image: '', rating: { rate: 4, count: 1 } },
      { id: 2, title: 'P2', price: 20, description: '', category: 'jewelery', image: '', rating: { rate: 4, count: 1 } },
    ],
    isLoading: false,
    isError: false,
  }),
}));

describe('CategoryPage', () => {
  it('renders categories header and cards', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <CategoryPage />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByText(/electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/jewelery/i)).toBeInTheDocument();
  });
});


