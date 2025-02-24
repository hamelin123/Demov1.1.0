const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: "#FFFFFF",
          dark: "#0A0A0A"
        },
        content: {
          light: "#1F2937",
          dark: "#FFFFFF"
        },
        card: {
          light: "#F3F4F6",
          dark: "#111827"
        }
      }
    }
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: "#FFFFFF",
          foreground: "#1F2937",
          primary: {
            DEFAULT: "#0066FF",
            foreground: "#FFFFFF",
          }
        }
      },
      dark: {
        colors: {
          background: "#0A0A0A",
          foreground: "#FFFFFF",
          primary: {
            DEFAULT: "#0066FF",
            foreground: "#FFFFFF",
          }
        }
      }
    }
  })]
};