/**
 * Theme Toggle Component
 * Simple button to toggle between light and dark themes
 */

import type { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleTheme } from '@/presentation/store/slices/uiSlice';

const ThemeToggle: FC = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.ui.theme);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="btn btn-outline-light btn-sm"
            aria-label="Toggle theme"
            type="button"
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;
