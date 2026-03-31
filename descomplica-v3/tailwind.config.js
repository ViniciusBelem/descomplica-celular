/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "#18181b",
        "surface-container": "#27272a",
        primary: "#6366f1",
        "primary-hover": "#4f46e5",
        secondary: "#a855f7",
        accent: "#14b8a6",
        success: "#10b981",
        error: "#ef4444",
        muted: "#a1a1aa",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}
