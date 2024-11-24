/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Update based on your file structure
  ],
  theme: {
    extend: {
      fontFamily: {
        muli: ["Muli", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        gilroy: ["Gilroy-Medium", "sans-serif"],
        spartan: ["Spartan", "sans-serif"],
      },
    },
  },
  plugins: [],
};
