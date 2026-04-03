/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      backdropBlur: {
        xs: '2px',
        glass: '15px',
        'glass-lg': '25px',
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0,0,0,0.15)',
        'glass-lg': '0 8px 40px rgba(0,0,0,0.2)',
      },
      fontFamily: {
        sans: ['IBM Plex Sans Thai', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
