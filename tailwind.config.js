/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#12121a',
        'bg-card': 'rgba(255,255,255,0.03)',
        'accent-blue': '#00d4ff',
        'accent-gold': '#c9a84c',
        'text-primary': '#e0e0e0',
        'text-secondary': '#888888',
        'border-subtle': 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        display: ['"Orbitron"', '"Rajdhani"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        body: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
