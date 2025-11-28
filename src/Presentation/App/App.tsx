import './global.css';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import RootNavigator from '@/navigation/RootNavigator';
import { ThemeProvider } from '@/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';

const queryClient = new QueryClient();

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider>
                            <RootNavigator />
                            <Toast />
                        </ThemeProvider>
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
        </I18nextProvider>
    );
}
