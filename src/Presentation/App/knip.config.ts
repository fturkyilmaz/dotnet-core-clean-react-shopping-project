import type { KnipConfig } from "knip";

const config: KnipConfig = {
    entry: [
        "src/**/*.{ts,tsx}",
        "app/**/*.{ts,tsx}",
        "*.config.{ts,js}",
    ],
    project: [
        "src/**/*.{ts,tsx}",
        "app/**/*.{ts,tsx}",
    ],
    ignore: [
        "**/*.d.ts",
        "src/assets/**",
        "coverage/**",
        ".maestro/**",
    ],
    ignoreDependencies: [
        // NativeWind ve Expo tarafından kullanılan implicit bağımlılıklar
        "tailwindcss",
        "postcss",
        "autoprefixer",
        // React Native implicit bağımlılıklar
        "react-native-worklets",
        // Test utilities
        "jest-expo",
        "@testing-library/react-native",
        // Sentry plugin
        "@sentry/cli",
    ],
    ignoreBinaries: [
        "maestro",
        "orval",
    ],
};

export default config;
