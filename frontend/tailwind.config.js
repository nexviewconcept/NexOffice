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
        primary: {
          DEFAULT: '#E50914', // Nexview Red base
          foreground: '#FFFFFF',
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
