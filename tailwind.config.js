/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // или добавить js/jsx/tsx, если нужно
  ],
  theme: {
    extend: {
      colors: {
        login: {
          box: '#37393F',
          field: '#202225',
          button: '#723269'
        },
        common: {
          dark: '#1B1B1B',
          context: '#323232'
        },
      },
    },
  },
  plugins: [],
} 
