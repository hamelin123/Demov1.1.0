// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066FF',
          dark: '#0055CC',
        },
        secondary: {
          DEFAULT: '#00C2FF',
          dark: '#00A3CC',
        },
        // Light mode colors
        background: {
          light: "#FFFFFF",
          DEFAULT: "#FFFFFF"
        },
        text: {
          light: "#1F2937",
          DEFAULT: "#1F2937"
        },
        // Dark mode colors
        dark: {
          background: "#111827",
          surface: "#1F2937",
          text: "#F9FAFB",
          muted: "#9CA3AF"
        },
        hero: {
          light: "#F3F4F6",
          dark: "#0F172A"
        },
        navbar: {
          light: "#F9FAFB",
          dark: "#111827"
        },
        footer: {
          light: "#111827",
          dark: "#0F172A"
        }
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [require('@nextui-org/react')],
};