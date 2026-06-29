/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Manrope', 'sans-serif'],
      },
      colors: {
        primary: '#2563eb',
      },
      boxShadow: {
        panel: '0 20px 70px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
