/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-dark': '#1a1a2e',
        'neo-dark-card': '#16213e',
        'neo-purple': '#7c3aed',
        'neo-purple-light': '#a78bfa',
        'neo-light': '#fefce8',
        'neo-light-card': '#fef9c3',
        'neo-yellow': '#facc15',
        'neo-yellow-dark': '#eab308',
        'neo-black': '#0f0f0f',
        'neo-white': '#ffffff',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #0f0f0f',
        'neo-hover': '2px 2px 0px 0px #0f0f0f',
        'neo-active': '0px 0px 0px 0px #0f0f0f',
        'neo-purple': '4px 4px 0px 0px #7c3aed',
        'neo-yellow': '4px 4px 0px 0px #facc15',
      },
      borderRadius: {
        'neo': '16px',
      }
    },
  },
  plugins: [],
}
