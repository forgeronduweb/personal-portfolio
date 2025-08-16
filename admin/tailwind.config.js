/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      ringColor: {
        DEFAULT: 'rgba(59, 130, 246, 0.5)', // blue-500 avec opacité
      },
    },
  },
  plugins: [],
  corePlugins: {
    ringWidth: true,
    ringColor: true,
    ringOffsetWidth: true,
    ringOffsetColor: true,
  }
}
