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
        jura: ["Jura", "sans-serif"],
        crimson_pro: ["Crimson Pro", "sans-serif"],
      },
    },
    screens: {
      // 320 360 390 412 440
      sm: "320", // Small screens (≥ 320px)
      md: "360", // Medium screens (≥ 360px)
      lg: "390", // Large screens (≥ 390px)
      xl: "412", // Extra large screens (≥ 412px)
      "2xl": "440", // 2x Extra large screens (≥ 440px)
    },
  },
  plugins: [],
};
