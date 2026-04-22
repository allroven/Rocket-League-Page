/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rl-blue': '#00BFFF',
        'rl-orange': '#FF8C00',
        'rl-dark': '#121212',
        'rl-gray': '#1E1E1E'
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
