/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // light mode primary (blue-600)
          700: '#1e40af', // dark mode primary (blue-700)
        },
        secondary: '#6b7280',
        background: '#ffffff',
        'background-dark': '#0f172a',
      },
    },
  },
  plugins: [],
};