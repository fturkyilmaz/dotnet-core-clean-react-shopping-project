module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Forbid importing TouchableOpacity directly from react-native
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-native',
            importNames: ['TouchableOpacity'],
            message:
              "Do not import `TouchableOpacity` from 'react-native'. Use the project's `AccessibleTouchable` component instead (e.g. `import AccessibleTouchable from 'src/components/AccessibleTouchable'`).",
          },
        ],
      },
    ],
  },
};
