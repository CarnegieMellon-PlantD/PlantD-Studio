/* eslint-env node */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  // Leverage style priority to work with Antd
  important: true,
  // Support toggling dark mode manually
  // See https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
  darkMode: 'class',
  theme: {
    extend: {},
    // Customize fonts
    // Make sure font faces are imported before usage
    fontFamily: {
      sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      logo: ['Righteous', ...defaultTheme.fontFamily.sans],
    },
    // Customize breakpoints to align with Antd
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1600px',
    },
  },
  corePlugins: {
    // Disable normalizer to work with Antd
    preflight: false,
  },
  plugins: [],
};
