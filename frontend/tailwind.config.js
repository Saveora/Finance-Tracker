/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",        // ✅ Pages and layouts
    "./src/components/**/*.{js,ts,jsx,tsx}"  // ✅ Reusable components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
