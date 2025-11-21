import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@store/slices/authSlice';
import cartReducer from '@store/slices/cartSlice';
import uiReducer from '@store/slices/uiSlice';
import preferencesReducer from '@store/slices/preferencesSlice';
import productsReducer from '@store/slices/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    preferences: preferencesReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
