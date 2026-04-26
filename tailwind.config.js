/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f1ff',
          100: '#e4e6ff',
          200: '#ced2ff',
          300: '#a9aeff',
          400: '#787eff',
          500: '#0511bb',
          600: '#040e9d',
          700: '#030b7e',
          800: '#020960',
          900: '#02074d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
