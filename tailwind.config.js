/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1DB954', // Spotify-like green
          dark: '#1AA34A',
          light: '#3DCB6C',
        },
        secondary: {
          DEFAULT: '#191414', // Dark background
          light: '#282828', // Lighter dark background
        },
        accent: {
          DEFAULT: '#B3B3B3', // Light gray
          dark: '#535353', // Mid gray
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s linear infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark/light mode toggle
}; 