import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';
type Language = 'en' | 'tr';

interface Modal {
  id: string;
  isOpen: boolean;
  data?: any;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  modals: Modal[];
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage?: string;
}

const initialState: UIState = {
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  language: (localStorage.getItem('language') as Language) || 'en',
  sidebarOpen: false,
  modals: [],
  notifications: [],
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<{ id: string; data?: any }>) => {
      const existingModal = state.modals.find((m) => m.id === action.payload.id);
      if (existingModal) {
        existingModal.isOpen = true;
        existingModal.data = action.payload.data;
      } else {
        state.modals.push({ id: action.payload.id, isOpen: true, data: action.payload.data });
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modal = state.modals.find((m) => m.id === action.payload);
      if (modal) {
        modal.isOpen = false;
      }
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({ id, ...action.payload });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
