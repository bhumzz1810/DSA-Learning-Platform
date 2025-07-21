/** @type {import('tailwindcss').Config} */
import tailwindcssBgPatterns from 'tailwindcss-bg-patterns';

const config = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
    theme: {
    extend: {
      colors: {
        theme: {
          light: {
            bg: '#f3f4f6',
            text: '#1f2937',
            card: '#ffffff',
            input: '#ffffff',
            border: '#d1d5db',
          },
          dark: {
            bg: '#111827',
            text: '#f9fafb',
            card: '#1f2937',
            input: '#374151',
            border: '#4b5563',
          },
          ocean: {
            bg: '#e0f7fa',
            text: '#004d40',
            card: '#ffffff',
            input: '#e0f2f1',
            border: '#80cbc4',
          },
          forest: {
            bg: '#e8f5e9',
            text: '#1b5e20',
            card: '#ffffff',
            input: '#dcedc8',
            border: '#81c784',
          },
        },
      },
    },
  },
  plugins: [
    tailwindcssBgPatterns,
  ],
};

export default config;
