const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    colors: {
      ...colors,
      gray: colors.zinc,
      blue: colors.sky,
    },
    extend: {},
  },
  plugins: [],
};
