export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        'card': '7 / 8',
      },
      width: {
        'card-small': '192px',
        'card-base': '284px'
      }
    },
  },
  plugins: [],
}

