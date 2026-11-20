/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-quicksand)', 'sans-serif'],
        hand: ['var(--font-hand)', 'cursive'],
      },
      colors: {
        white: 'rgb(var(--c-white) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        inkLight: 'rgb(var(--c-inkLight) / <alpha-value>)',
        peachSoft: 'rgb(var(--c-peachSoft) / <alpha-value>)',
        peachBorder: 'rgb(var(--c-peachBorder) / <alpha-value>)',
        butter: 'rgb(var(--c-butter) / <alpha-value>)',
        butterBorder: 'rgb(var(--c-butterBorder) / <alpha-value>)',
        mintSoft: 'rgb(var(--c-mintSoft) / <alpha-value>)',
        mintBorder: 'rgb(var(--c-mintBorder) / <alpha-value>)',
        pinkSoft: 'rgb(var(--c-pinkSoft) / <alpha-value>)',
        pinkBorder: 'rgb(var(--c-pinkBorder) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
