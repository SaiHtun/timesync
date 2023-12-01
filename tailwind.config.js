/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        blink: {
          "50%": {
            opacity: 0,
          },
        },
      },
      animation: {
        blinker: "blink 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
