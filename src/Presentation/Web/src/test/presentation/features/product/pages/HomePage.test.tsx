import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import HomePage from '@/presentation/features/product/pages/HomePage';

vi.mock('@/presentation/features/product/hooks/useProducts', () => ({
  useProducts: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

describe('HomePage', () => {
  it('renders empty products state with i18n texts', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <HomePage />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });
});


