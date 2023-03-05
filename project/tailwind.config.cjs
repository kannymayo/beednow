/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: { gridTemplateRows: { 12: 'repeat(12, minmax(0, 1fr))' } },
  },
  plugins: [],
}
