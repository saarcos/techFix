/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'inter':["'Inter'",'sans-serif']
      },
      colors: {
        customGreen: '#00E599',
        customGray: '#1E293B',
      }
    },
  },
  plugins: [],
}