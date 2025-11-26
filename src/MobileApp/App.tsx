import './global.css';
import './i18n';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import RootNavigator from '@/navigation/RootNavigator';
import { ThemeProvider } from '@/context/ThemeContext';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

export default function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <RootNavigator />
                    <Toast />
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    );
}
