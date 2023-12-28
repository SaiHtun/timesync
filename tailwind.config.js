/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dial-dawn": "var(--color-dawn)", // 6am, 7am
        "dial-midday": "var(--color-midday)", // 8am -> 17pm
        "dial-dusk": "var(--color-dusk)", // 18pm -> 21pm
        "dial-midnight": "var(--color-midnight)", // 22pm -> 5am
        "dial-newday": "var(--color-newday)", // 24 | 12
      },
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
