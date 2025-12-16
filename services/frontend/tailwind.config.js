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
        gold: {
          50: '#fffef7',
          100: '#fffceb',
          200: '#fff8d6',
          300: '#fff0b3',
          400: '#ffe485',
          500: '#ffd24d',
          600: '#f5b800',
          700: '#d19900',
          800: '#a67c00',
          900: '#7a5c00',
        },
      },
    },
  },
  plugins: [],
}
