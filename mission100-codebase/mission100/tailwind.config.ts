import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "Georgia", "serif"],
      },
      colors: {
        gold: {
          DEFAULT: "#C8A96E",
          light: "rgba(200,169,110,0.12)",
          muted: "rgba(200,169,110,0.18)",
          border: "rgba(200,169,110,0.25)",
        },
        teal: {
          app: "#4A7C6F",
          light: "#7EC8B5",
          bg: "rgba(74,124,111,0.1)",
          border: "rgba(74,124,111,0.2)",
        },
        surface: {
          dark: "#0D0F0E",
          card: "#1A1C1B",
          elevated: "#232523",
          cream: "#F5F2EC",
          light: "#F0EDE6",
        },
        stone: {
          app: "#8C8880",
          muted: "#6B6860",
        },
      },
      borderRadius: {
        app: "12px",
        "app-lg": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
