/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", 'sans-serif'],
        rajdhani: ["'Rajdhani'", 'system-ui', 'sans-serif'],
      },
      colors: {
        mountain: {
          sky:      '#2e6fa0',
          peak:     '#b8ccd8',
          snow:     '#eef3f7',
          ridge:    '#3d6b88',
          forest:   '#285242',
          ground:   '#1a2e1e',
          trail:    '#7a6048',
          horizon:  '#dfc9a0',
        },
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

