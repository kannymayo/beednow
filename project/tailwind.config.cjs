/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: { 12: '50px, repeat(9, minmax(0, 1fr)), 40px, 40px' },
    },
  },
  plugins: [],
}
