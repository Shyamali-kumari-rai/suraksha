/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        suraksha: {
          bg: '#ECEFE4',
          surface: '#FFFFFF',
          forest: '#112E24',
          'forest-mid': '#154032',
          sage: '#BCD8A6',
          'sage-soft': '#DCEBD0',
          olive: '#7FA16B',
          yellow: '#FDE02E',
          coral: '#EE552A',
          red: '#DC2626',
          green: '#16A34A',
          muted: '#4B5D54',
          border: '#D8DFD1'
        }
      }
    },
  },
  plugins: [],
}
