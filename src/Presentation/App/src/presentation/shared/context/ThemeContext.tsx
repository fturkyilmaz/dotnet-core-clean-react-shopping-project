import React, { createContext, useContext, useState, useEffect } from 'react';
import sqliteRepository from '@/infrastructure/persistence/SQLiteRepository';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useSystemColorScheme();
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await sqliteRepository.getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme as Theme);
                } else {
                    setTheme((systemColorScheme as Theme) || 'light');
                }
            } catch (error) {
                console.error('Failed to load theme', error);
                setTheme('light');
            }
        };
        loadTheme();
    }, [systemColorScheme]);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await sqliteRepository.setItem('theme', newTheme);
        } catch (error) {
            console.error('Failed to save theme', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
