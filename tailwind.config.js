export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      blue: {
        DEFAULT: '#1491D1',
        light: '#41A9DF'
      },
      arctic: {
        DEFAULT: '#9AD5F3',
        light: '#B4DBEF'
      },
      leaf: {
        DEFAULT: '#E4EDD9',
        light: '#ECF8E2'
      },
      orange: {
        DEFAULT: '#FBC56F',
        light: '#F7D279'
      },
      pink: {
        DEFAULT: '#F388A5',
        light: '#F599B3'
      },
      grey: {
        DEFAULT: '#959595',
        light: '#D2D2D2',
        dark: '#4F4F4F'
      },
      red: '#F66A6A',
      purple: '#896AF6',
      parchment: '#F3F1EA',
      white: '#FFFFFF',
      black: '#000000'
    },
    extend: {
      fontFamily: {
        primary: ['Arial Rounded MT Bold', 'Arial', 'sans-serif']
      },
      aspectRatio: {
        card: '7 / 8.25'
      },
      width: {
        'card-small': '192px',
        'card-base': '260px',
        'card-large': '300px'
      },
      maxWidth: {
        app: '1306px',
        'screen-2.5xl': '1404px'
      },
      borderRadius: {
        'card-small': '20px',
        'card-base': '36px'
      },
      gridTemplateColumns: {
        'deck-view-lg': '284px minmax(811px, 1024px)',
        'deck-desktop': 'repeat(4, 192px)'
      }
    }
  },
  plugins: []
}
