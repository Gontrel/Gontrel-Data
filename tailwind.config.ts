import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand blue scale based on provided styleguide
        blue: {
          50: '#eaf2ff',
          100: '#d6e6ff',
          200: '#adcaff',
          300: '#7ea9ff',
          400: '#4c87ff',
          500: '#0070F3', // Gontrel Blue
          600: '#005bd0',
          700: '#0046a6',
          800: '#003a87',
          900: '#002a61',
        },
        purple: {
          50: '#f5e9ff',
          100: '#eed2ff',
          200: '#dda7ff',
          300: '#cb7bff',
          400: '#b94fff',
          500: '#BD00FF', // Gontrel Purple
          600: '#9900cc',
          700: '#770099',
          800: '#5b0073',
          900: '#3c004d',
        },
        teal: {
          50: '#e8fffb',
          100: '#c9fff6',
          200: '#93ffee',
          300: '#5cffea',
          400: '#26ffe6',
          500: '#00FFE0', // Gontrel Teal
          600: '#00d0b8',
          700: '#00a590',
          800: '#007d6d',
          900: '#00574b',
        },
        neutral: {
          5: '#FAFAFA',
          50: '#F0F1F2',
          100: '#D2D4D5',
          200: '#BCBFC1',
          300: '#9DA1A5',
          400: '#8A8F93',
          500: '#6D7378',
          600: '#63696D',
          700: '#4D5255',
          800: '#3C3F42',
          900: '#2E3032',
          950: '#171A1C',
        },
        brand: {
          50: '#eaf2ff',
          100: '#d6e6ff',
          200: '#adcaff',
          300: '#7ea9ff',
          400: '#4c87ff',
          500: '#1E7BFF',
          600: '#0070F3',
          700: '#005bd0',
          800: '#0046a6',
          900: '#003a87',
        },
      },
      fontFamily: {
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;


