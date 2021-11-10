const blueprintColors = {
  black: '#111418',
  white: '#ffffff',
  darkgray: {
    1: '#1c2127',
    2: '#252a31',
    3: '#2f343c',
    4: '#383e47',
    5: '#404854',
  },
  gray: {
    1: '#626e7f',
    2: '#738091',
    3: '#8f99a8',
    4: '#abb3bf',
    5: '#c5cbd3',
  },
  lightgray: {
    1: '#d3d8de',

    2: '#dce0e5',
    3: '#e5e8eb',
    4: '#edeff2',
    5: '#f6f7f9',
  },
  blue: {
    1: '#184a90',
    2: '#1a5bb7',
    3: '#1a69d5',
    4: '#498ff3',
    5: '#8abbff',
  },
  green: {
    1: '#165a32',
    2: '#176d3a',
    3: '#168845',
    4: '#30a660',
    5: '#72ca96',
  },
  orange: {
    1: '#77450d',
    2: '#935610',
    3: '#c4761c',
    4: '#ea9a3e',
    5: '#f7b264',
  },
  red: {
    1: '#942427',
    2: '#b3292d',
    3: '#d33136',
    4: '#e96367',
    5: '#f99498',
  },
  vermilion: {
    1: '#96290d',
    2: '#b83211',
    3: '#d33d17',
    4: '#eb6847',
    5: '#ff9980',
  },
  rose: {
    1: '#a82255',
    2: '#c22762',
    3: '#db2c6f',
    4: '#f5498b',
    5: '#ff66a1',
  },
  violet: {
    1: '#5c255c',
    2: '#7c327c',
    3: '#9d3f9d',
    4: '#bd6bbd',
    5: '#d69fd6',
  },
  indigo: {
    1: '#5642a6',
    2: '#634dbf',
    3: '#7961db',
    4: '#9881f3',
    5: '#bdadff',
  },
  cerulean: {
    1: '#1f4b99',
    2: '#2458b3',
    3: '#2965cc',
    4: '#4580e6',
    5: '#669eff',
  },
  turquoise: {
    1: '#004d46',
    2: '#007067',
    3: '#00a396',
    4: '#13c9ba',
    5: '#7ae1d8',
  },
  forest: {
    1: '#1d7324',
    2: '#238c2c',
    3: '#29a634',
    4: '#43bf4d',
    5: '#62d96b',
  },
  lime: {
    1: '#43501b',
    2: '#5a701a',
    3: '#8eb125',
    4: '#b6d94c',
    5: '#d4f17e',
  },
  gold: {
    1: '#5c4405',
    2: '#866103',
    3: '#d1980b',
    4: '#f0b726',
    5: '#fbd065',
  },
  sepia: {
    1: '#5e4123',
    2: '#7a542e',
    3: '#946638',
    4: '#af855a',
    5: '#d0b090',
  },
};

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  mode: 'jit',
  purge: ['./components/**/*.tsx', './pages/**/*.tsx', './styles/**/*.scss'],
  darkMode: 'class',
  theme: {
    colors: {
      ...blueprintColors,
      transparent: 'transparent',
      current: 'currentColor',
      intent: {
        primary: blueprintColors.blue[3],
        success: blueprintColors.green[3],
        warning: blueprintColors.orange[3],
        danger: blueprintColors.red[3],
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
