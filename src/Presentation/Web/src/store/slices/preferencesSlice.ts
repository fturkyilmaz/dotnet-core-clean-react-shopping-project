import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  currency: 'USD' | 'EUR' | 'TRY';
  itemsPerPage: number;
  defaultView: 'grid' | 'list';
  autoSave: boolean;
}

interface PreferencesState extends UserPreferences {
  isInitialized: boolean;
}

const defaultPreferences: UserPreferences = {
  emailNotifications: true,
  pushNotifications: false,
  currency: 'USD',
  itemsPerPage: 12,
  defaultView: 'grid',
  autoSave: true,
};

const loadPreferences = (): UserPreferences => {
  const stored = localStorage.getItem('userPreferences');
  if (stored) {
    try {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    } catch {
      return defaultPreferences;
    }
  }
  return defaultPreferences;
};

const initialState: PreferencesState = {
  ...loadPreferences(),
  isInitialized: true,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      Object.assign(state, action.payload);
      const { isInitialized, ...preferences } = state;
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    toggleEmailNotifications: (state) => {
      state.emailNotifications = !state.emailNotifications;
      const { isInitialized, ...preferences } = state;
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    togglePushNotifications: (state) => {
      state.pushNotifications = !state.pushNotifications;
      const { isInitialized, ...preferences } = state;
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    setCurrency: (state, action: PayloadAction<'USD' | 'EUR' | 'TRY'>) => {
      state.currency = action.payload;
      const { isInitialized, ...preferences } = state;
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      const { isInitialized, ...preferences } = state;
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    setDefaultView: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.defaultView = action.payload;
      const { isInitialized, ...preferences } = state;
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    toggleAutoSave: (state) => {
      state.autoSave = !state.autoSave;
      const { isInitialized, ...preferences } = state;
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    resetPreferences: (state) => {
      Object.assign(state, defaultPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    },
  },
});

export const {
  updatePreferences,
  toggleEmailNotifications,
  togglePushNotifications,
  setCurrency,
  setItemsPerPage,
  setDefaultView,
  toggleAutoSave,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
