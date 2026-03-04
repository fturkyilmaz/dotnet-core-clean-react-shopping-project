import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import ReduxSQLiteStorage from '@/infrastructure/persistence/ReduxSQLiteStorage';
import authReducer from '@/presentation/store/slices/authSlice';
import productsReducer from '@/presentation/store/slices/productsSlice';
import cartReducer from '@/presentation/store/slices/cartSlice';
import offlineMiddleware from '@/presentation/store/middleware/offlineMiddleware';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: 'root',
  storage: ReduxSQLiteStorage,
  whitelist: ['cart'], // Only persist cart - auth tokens are stored in secureStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(offlineMiddleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
