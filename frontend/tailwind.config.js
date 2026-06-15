/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blinkit-yellow': '#F3CE2D',
        'blinkit-dark': '#1C1C1C',
        'blinkit-gray': '#F5F5F5',
      }
    },
  },
  plugins: [],
}