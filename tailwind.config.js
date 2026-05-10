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
        mono: ["'JetBrains Mono'", "'Courier New'", 'Courier', 'monospace'],
      },
      colors: {
        // Semantic tokens — auto-swap between light/dark via .dark on root
        bg: 'var(--bg)',
        'bg-soft': 'var(--bg-soft)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'accent-strong': 'var(--accent-strong)',
        'on-accent': 'var(--on-accent)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(37,52,63,0.06)',
        'soft-dark': '0 4px 24px rgba(0,0,0,0.4)',
        'accent-glow': '0 0 0 1px var(--accent-soft), 0 8px 24px -8px var(--accent)',
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
