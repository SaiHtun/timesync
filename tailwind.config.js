/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // primary
        "dial-primary-dawn": "var(--color-primary-dawn)",
        "dial-primary-midday": "var(--color-primary-midday)",
        "dial-primary-dusk": "var(--color-primary-dusk)",
        "dial-primary-midnight": "var(--color-primary-midnight)",
        "dial-primary-newday": "var(--color-primary-newday)",
        // teal
        "dial-teal-dawn": "var(--color-teal-dawn)", // 6am, 7am
        "dial-teal-midday": "var(--color-teal-midday)", // 8am -> 17pm
        "dial-teal-dusk": "var(--color-teal-dusk)", // 18pm -> 21pm
        "dial-teal-midnight": "var(--color-teal-midnight)", // 22pm -> 5am
        "dial-teal-newday": "var(--color-teal-newday)", // 24 | 12
        // indigo
        "dial-indigo-dawn": "var(--color-indigo-dawn)",
        "dial-indigo-midday": "var(--color-indigo-midday)",
        "dial-indigo-dusk": "var(--color-indigo-dusk)",
        "dial-indigo-midnight": "var(--color-indigo-midnight)",
        "dial-indigo-newday": "var(--color-indigo-newday)",
        // cyan
        "dial-cyan-dawn": "var(--color-cyan-dawn)",
        "dial-cyan-midday": "var(--color-cyan-midday)",
        "dial-cyan-dusk": "var(--color-cyan-dusk)",
        "dial-cyan-midnight": "var(--color-cyan-midnight)",
        "dial-cyan-newday": "var(--color-cyan-newday)",
        // pink
        "dial-pink-dawn": "var(--color-pink-dawn)",
        "dial-pink-midday": "var(--color-pink-midday)",
        "dial-pink-dusk": "var(--color-pink-dusk)",
        "dial-pink-midnight": "var(--color-pink-midnight)",
        "dial-pink-newday": "var(--color-pink-newday)",
        // purple
        "dial-purple-dawn": "var(--color-purple-dawn)",
        "dial-purple-midday": "var(--color-purple-midday)",
        "dial-purple-dusk": "var(--color-purple-dusk)",
        "dial-purple-midnight": "var(--color-purple-midnight)",
        "dial-purple-newday": "var(--color-purple-newday)",
        // blue
        "dial-blue-dawn": "var(--color-blue-dawn)",
        "dial-blue-midday": "var(--color-blue-midday)",
        "dial-blue-dusk": "var(--color-blue-dusk)",
        "dial-blue-midnight": "var(--color-blue-midnight)",
        "dial-blue-newday": "var(--color-blue-newday)",
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
