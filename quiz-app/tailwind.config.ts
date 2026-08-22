import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        highschool: "#38bdf8",
        adult: "#f472b6",
        choiceA: "#22c55e",
        choiceB: "#f59e0b",
      },
    },
  },
  plugins: [],
};

export default config;
