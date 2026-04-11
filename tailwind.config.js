/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'bg-base':   '#080603',
        'bg-card':   'rgba(255,255,255,0.025)',
        gold:        '#d4a843',
        'gold-dim':  '#5a3e1b',
        'gold-border': 'rgba(201,168,76,0.15)',
        fire:        '#ff6b00',
        blood:       '#8b1a1a',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
