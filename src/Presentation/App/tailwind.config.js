/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        
        primary: {
          DEFAULT: '#2563eb',
          400: '#60a5fa',
          700: '#1e40af', 
        },
        secondary: {
          DEFAULT: '#6b7280',
          400: '#6b7280',
          700: '#6b7280', 
        },

        background: '#ffffff',
        'background-dark': '#0f172a',
      },
    },
  },
  plugins: [],
};