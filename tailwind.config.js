/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'greenbutton': "#1982C4",
        'lightpink' : '#f3c19e'
      }
        },
  },
  plugins: [],
}