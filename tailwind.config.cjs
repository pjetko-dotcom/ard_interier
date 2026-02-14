/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#faf5f1',
          100: '#f5f0eb',
          200: '#e8dcd0',
          300: '#d9c7b8',
          400: '#c7a583',
          500: '#b8905c',
          600: '#a27d4f',
          700: '#8a6a42',
          800: '#6b5435',
          900: '#544131',
          950: '#2d2415',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29d',
          500: '#78716b',
          600: '#57534e',
          700: '#45403f',
          800: '#292524',
          850: '#1c1917',
          900: '#0f0e0d',
          950: '#09080a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
}
