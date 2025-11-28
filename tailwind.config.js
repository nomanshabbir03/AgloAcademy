/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'heading': ['Montserrat', 'ui-sans-serif', 'system-ui'],
        'body': ['Open Sans', 'ui-sans-serif', 'system-ui'],
        'montserrat': ['Montserrat', 'ui-sans-serif', 'system-ui'],
        'open-sans': ['Open Sans', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          dark: '#0f3464',      // Primary Dark Blue
          bright: '#0078d4',    // Primary Bright Blue
          accent: '#54daff',    // Accent Cyan
          secondary: '#4185be', // Secondary Blue
          muted: '#5a86ad',     // Muted Blue
          50: '#f0f8ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0078d4',
          600: '#0f3464',
          700: '#0c2a52',
          800: '#0a2140',
          900: '#08182e',
        }
      }
    },
  },
  plugins: [],
}
