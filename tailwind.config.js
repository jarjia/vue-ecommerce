/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: { max: "770px" },
        "av-desk": { max: "1273px" },
        "medium-desk": { max: "1335px" },
        "mini-desk": { max: "940px" },
        mobile: { max: "660px" },
        "avg-desk-for-view": { max: "1037px" },
        "big-h": { raw: "(min-height: 940px)" },
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
