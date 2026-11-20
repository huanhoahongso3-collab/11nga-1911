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
        cream: '#FFFDF9',
        ink: '#4A4238',
        inkLight: '#7A7065',
        peachSoft: '#FFD8BE',
        peachBorder: '#F3BE9C',
        butter: '#FFF3C4',
        butterBorder: '#EBD584',
        mintSoft: '#D8F3DC',
        mintBorder: '#A9DFB1',
        pinkSoft: '#FFE5EC',
        pinkBorder: '#F6BDCB',
      },
    },
  },
  plugins: [],
};
