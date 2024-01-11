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
        'card-base': '284px',
        'card-large': '300px',
      },
      maxWidth: {
        'screen-2.5xl': '1404px'
      },
      borderRadius: {
        'card-small': '20px',
        'card-base': '36px'
      },
      gridTemplateColumns: {
        'deck-view-lg': '284px minmax(811px, 1024px)',
        'deck-desktop': 'repeat(4, 192px)',
      }
    },
  },
  plugins: [],
}

