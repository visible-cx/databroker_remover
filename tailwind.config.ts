import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warmgray: {
          DEFAULT: "#e5e7eb",
        },
        plum: {
          500: "#6f6a8a",
          600: "#5f5a7a",
          700: "#4f4a6a",
          750: "#453f5f",
          800: "#3f3a5a",
          900: "#2E2A44",
        },
      },
    },
  },
  plugins: [],
};

export default config;
