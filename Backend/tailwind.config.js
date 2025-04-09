/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./src/styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0e606e',
        secondary: '#ff9700'
      }
    }
  },
  plugins: []
}
