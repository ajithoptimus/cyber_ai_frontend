/** @type {import('tailwindcss').Config} */
export default {
  // This 'content' array tells Tailwind to scan
  // all of your .tsx and .html files for class names.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}