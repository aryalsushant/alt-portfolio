/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 8px 2px #00fff7, 0 0 16px 4px #00fff7',
        'glow': '0 0 8px 2px #38bdf8, 0 0 16px 4px #38bdf8',
      },
      textShadow: {
        glow: '0 0 8px #00fff7, 0 0 16px #00fff7',
      },
    },
  },
  plugins: [],
}

