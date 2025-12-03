import type { FC } from "react";
import { useTheme } from "../hooks";

const ThemeToggle: FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-outline-light btn-sm"
            aria-label="Toggle theme"
            type="button"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
};

export default ThemeToggle;
