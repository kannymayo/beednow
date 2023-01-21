const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: { 12: '50px, repeat(9, minmax(0, 1fr)), 40px, 40px' },
      gridTemplateColumns: {
        13: 'minmax(300px, 2fr),repeat(12, minmax(0, 1fr))',
      },
      gridColumn: { 'span-13': 'span 13 / span 13' },
    },
  },
  plugins: [
    require('daisyui'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })
    }),
  ],
}
