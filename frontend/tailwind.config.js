/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode based on class
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5FDE5',
          100: '#E9F9C6',
          200: '#D9F99D',
          300: '#BEF264',
          400: '#A3E635',
          500: '#7CB342',
          600: '#5F8B2F',
          700: '#4D6B24',
          800: '#3F6212',
          900: '#365314',
          950: '#1A2E05',
        },
        secondary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        }
      }
    },
  },
  plugins: [],
}