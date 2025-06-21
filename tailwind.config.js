/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#F5F7FA',
          text: '#1F2937',
          primary: '#0057A0',
          accent: '#F49D37',
        },
        dark: {
          background: '#0D1117',
          text: '#E6EDF3',
          primary: '#58A6FF',
          accent: '#F4A261',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}; 