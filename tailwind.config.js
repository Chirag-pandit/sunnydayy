/** @type {import('tailwindcss').Config} */
export default {
  // content: ['./index.html', './src//*.{js,ts,jsx,tsx}'],
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}', // ✅ Correct glob pattern
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFFFF', // White
          light: '#F5F5F5',
          dark: '#E5E5E5',
        },
        secondary: {
          DEFAULT: '#1A1A1A', // Dark Grey/Almost Black
          light: '#2A2A2A',
          dark: '#111111',
        },
        accent: {
          DEFAULT: '#FF0000', // Accent Red
          light: '#FF3333',
          dark: '#CC0000',
        },
        success: {
          DEFAULT: '#00C851',
          light: '#00E676',
          dark: '#00994D',
        },
        warning: {
          DEFAULT: '#FFBB33',
          light: '#FFD54F',
          dark: '#FF8800',
        },
        error: {
          DEFAULT: '#ff4444',
          light: '#FF5252',
          dark: '#CC0000',
        },
        gray: {
          100: '#f7f7f7',
          200: '#e6e6e6',
          300: '#d5d5d5',
          400: '#b4b4b4',
          500: '#939393',
          600: '#727272',
          700: '#515151',
          800: '#303030',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-in forwards',
      },
       keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(to bottom, rgba(17, 17, 17, 0.8), rgba(17, 17, 17, 0.9)), url('https://images.pexels.com/photos/4754139/pexels-photo-4754139.jpeg')",
        'texture': "url('https://images.pexels.com/photos/5089151/pexels-photo-5089151.jpeg')",
      },
    },
  },
  plugins: [],
};