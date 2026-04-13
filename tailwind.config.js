/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#fa9602',
          50:  '#fff8eb',
          100: '#ffefc7',
          200: '#ffdb8a',
          300: '#ffc14d',
          400: '#ffa620',
          500: '#fa9602',
          600: '#dd7200',
          700: '#b75204',
          800: '#943f0b',
          900: '#7a350d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
