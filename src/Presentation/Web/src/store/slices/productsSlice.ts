import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

interface ProductsState {
  filters: ProductFilters;
  selectedProductId: number | null;
  compareList: number[];
  recentlyViewed: number[];
}

const initialState: ProductsState = {
  filters: {},
  selectedProductId: null,
  compareList: JSON.parse(localStorage.getItem('compareList') || '[]'),
  recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed') || '[]'),
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    updateFilter: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedProduct: (state, action: PayloadAction<number | null>) => {
      state.selectedProductId = action.payload;
    },
    addToCompare: (state, action: PayloadAction<number>) => {
      if (!state.compareList.includes(action.payload) && state.compareList.length < 4) {
        state.compareList.push(action.payload);
        localStorage.setItem('compareList', JSON.stringify(state.compareList));
      }
    },
    removeFromCompare: (state, action: PayloadAction<number>) => {
      state.compareList = state.compareList.filter((id) => id !== action.payload);
      localStorage.setItem('compareList', JSON.stringify(state.compareList));
    },
    clearCompareList: (state) => {
      state.compareList = [];
      localStorage.removeItem('compareList');
    },
    addToRecentlyViewed: (state, action: PayloadAction<number>) => {
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter((id) => id !== action.payload);
      // Add to beginning
      state.recentlyViewed.unshift(action.payload);
      // Keep only last 10
      if (state.recentlyViewed.length > 10) {
        state.recentlyViewed = state.recentlyViewed.slice(0, 10);
      }
      localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed));
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
      localStorage.removeItem('recentlyViewed');
    },
  },
});

export const {
  setFilters,
  updateFilter,
  clearFilters,
  setSelectedProduct,
  addToCompare,
  removeFromCompare,
  clearCompareList,
  addToRecentlyViewed,
  clearRecentlyViewed,
} = productsSlice.actions;

export default productsSlice.reducer;
