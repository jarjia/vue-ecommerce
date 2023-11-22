/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: { max: "770px" },
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ".scrollbar": {
          overflowY: "auto",
          scrollbarColor: `#808189e5 transparent`,
          scrollbarWidth: "auto",
        },
        ".scrollbar::-webkit-scrollbar": {
          height: "4px",
          width: "6px",
        },
        ".scrollbar::-webkit-scrollbar-thumb": {
          backgroundColor: "#808189e5",
          borderRadius: "50px",
        },
      });
    }),
  ],
};
