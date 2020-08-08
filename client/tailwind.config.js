module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      textColor: {
        'twitter': '#00ACEE',
        'twitch': '#6441a5',
      },
    },
  },
  variants: {},
  plugins: [],
}
