export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        'card': '7 / 8.25',
      },
      width: {
        'card-small': '192px',
        'card-base': '284px'
      },
      maxWidth: {
        'screen-2.5xl': '1404px'
      },
      borderRadius: {
        'card-small': '20px',
        'card-base': '36px'
      },
      gridTemplateColumns: {
        'deck-desktop': 'repeat(4, 192px)',
      }
    },
  },
  plugins: [],
}

