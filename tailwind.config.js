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
        "avg-desk-for-view": { max: "1037px" },
        mobile: { max: "660px" },
        "big-h": { raw: "(min-height: 940px)" },
        "sm-mobile": { max: "412px" },
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ".scrollbar": {
          overflowY: "auto",
          scrollbarColor: `#9FA0A7 transparent`,
          scrollbarWidth: "auto",
        },
        ".scrollbar::-webkit-scrollbar": {
          height: "4px",
          width: "6px",
        },
        ".scrollbar::-webkit-scrollbar-thumb": {
          backgroundColor: "#9FA0A7",
          borderRadius: "50px",
        },
      });
    }),
  ],
};
