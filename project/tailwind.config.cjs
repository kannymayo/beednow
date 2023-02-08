const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        '2-header-body': '50px, minmax(0, 1fr)',
        '3-2details-1list': '1fr, 1fr,80px',
      },
      gridTemplateColumns: {
        '3-1list-2details': 'minmax(200px,2fr), repeat(2,3fr)',
      },
      screens: {
        '4xl': '2048px',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms'),
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
