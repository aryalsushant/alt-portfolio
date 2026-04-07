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
        display: ["'Space Grotesk'", 'system-ui', 'sans-serif'],
        sans: ["'Inter'", 'system-ui', '-apple-system', 'sans-serif'],
        mono: ["'Courier New'", 'Courier', 'monospace'],
      },
      colors: {
        cyan: {
          400: '#00F5FF',
          300: '#67e8f9',
          500: '#06b6d4',
        },
        neon: {
          cyan: '#00F5FF',
          green: '#39FF14',
          purple: '#BF00FF',
        },
      },
      boxShadow: {
        'neon': '0 0 8px 2px #00F5FF, 0 0 20px 4px rgba(0,245,255,0.3)',
        'neon-sm': '0 0 6px 1px rgba(0,245,255,0.6)',
        'glow': '0 0 8px 2px #38bdf8, 0 0 16px 4px #38bdf8',
        'indigo': '0 0 8px 2px rgba(79,70,229,0.5), 0 0 20px 4px rgba(79,70,229,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
