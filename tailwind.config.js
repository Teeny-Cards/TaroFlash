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
      xs: '9px',
      sm: '12px',
      DEFAULT: '14px',
      md: '16px',
      lg: '18px',
      xl: '32px',
      '2xl': '38px',
      '3xl': '48px',
      '4xl': '64px',
      full: '9999px'
    },
    boxShadow: {
      DEFAULT: '4px 4px 10px 0px rgba(0,0,0,0.15)',
      modal: '8px 8px 42.9px 0px rgba(0,0,0,0.25)'
    },
    extend: {
      fontFamily: {
        primary: ['Arial Rounded MT Bold', 'Arial', 'sans-serif']
      },
      aspectRatio: {
        card: '7 / 8.25'
      },
      spacing: {
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
