// tailwind.config.js

/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          light: '#FDBA74', // برتقالي فاتح
          DEFAULT: '#F97316', // البرتقالي الأساسي
          dark: '#C2410C', // برتقالي غامق
        },

        secondary: '#4B5563',
        danger: '#EF4444',
        success: '#22C55E',
        warning: '#F97316',

        'surface-ground': '#1F2937',
        'surface-section': '#374151',
        'surface-border': '#4B5563',

        'text-primary': '#F9FAFB',
        'text-secondary': '#D1D5DB',
        'text-muted': '#9CA3AF',
      },
    },
  },
  plugins: [],
}
