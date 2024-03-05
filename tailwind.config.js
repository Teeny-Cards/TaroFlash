export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './docs/.vitepress/**/*.{js,ts,vue}',
    './docs/**/*.md'
  ],
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
      parchment: '#F3F1EA',
      white: '#FFFFFF',
      black: '#000000'
    },
    borderRadius: {
      full: '9999px',
      'btn-large': '18px',
      'btn-base': '16px',
      'btn-small': '14px',
      'btn-teeny': '12px',
      'card-teeny': '9px',
      'card-xs': '14px',
      'card-small': '32px',
      'card-base': '48px',
      'card-large': '64px'
    },
    boxShadow: {
      DEFAULT: '4px 4px 10px 0px rgba(0,0,0,0.15)'
    },
    extend: {
      fontFamily: {
        primary: ['Arial Rounded MT Bold', 'Arial', 'sans-serif']
      },
      aspectRatio: {
        card: '7 / 8.25'
      },
      width: {
        'card-teeny': '28px',
        'card-xs': '43px',
        'card-small': '138px',
        'card-base': '192px',
        'card-large': '260px'
      },
      maxWidth: {
        app: '1306px',
        'screen-2.5xl': '1404px'
      },
      gridTemplateColumns: {
        'deck-view-lg': '284px minmax(811px, 1024px)',
        'deck-desktop': 'repeat(4, 192px)'
      }
    }
  },
  plugins: []
}
