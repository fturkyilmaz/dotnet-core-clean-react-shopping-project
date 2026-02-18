/** @type {import('jest').Config} */
module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest.pre-setup.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/tw/**/*',
        '!src/types/**/*',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    clearMocks: true,
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@testing-library/react-native)',
    ],
};
