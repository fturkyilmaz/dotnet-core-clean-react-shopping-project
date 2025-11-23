import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { Cart } from '@/types';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (username: string) => {
  const response = await api.get<Cart>(`/carts/${username}`);
  return response.data;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ username, productId, quantity }: { username: string; productId: number; quantity: number }) => {
    // Assuming API structure for adding to cart
    // This might need adjustment based on actual API implementation
    const response = await api.post('/carts', { username, items: [{ productId, quantity }] });
    return response.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      });
  },
});

export default cartSlice.reducer;
