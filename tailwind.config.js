/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000', // Deep Matte Black
        accent: '#CCFF00',  // Electric Lime Green
        secondary: '#2E5BFF', // Cobalt Blue
      },
      fontFamily: {
        sans: ['Space Grotesque', 'Montserrat', 'sans-serif'],
        mono: ['monospace'], // You can add a specific mono font if needed
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
    },
  },
  plugins: [],
}
