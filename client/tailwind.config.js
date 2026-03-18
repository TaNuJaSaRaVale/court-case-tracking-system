/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {

      colors: {
        brand: {
          primary:   "#1E3A5F", // Deep navy — trust, authority
          secondary: "#2E6DA4", // Medium blue — interactive
          accent:    "#F0A500", // Warm amber — CTAs, highlights
          light:     "#EBF4FF", // Very light blue — backgrounds
        },

        // Status colors — used for case stages,
        // document status, hearing urgency
        status: {
          success:  "#16A34A",
          warning:  "#D97706",
          critical: "#DC2626",
          info:     "#2563EB",
          neutral:  "#6B7280",
        },

        // Surface colors — backgrounds, cards, borders
        surface: {
          page:    "#F8FAFC", // App background
          card:    "#FFFFFF", // Card background
          subtle:  "#F1F5F9", // Subtle section bg
          border:  "#E2E8F0", // Default border
          muted:   "#CBD5E1", // Muted border
        },

        // Text colors — semantic names
        text: {
          primary:   "#0F172A", // Main text
          secondary: "#475569", // Supporting text
          muted:     "#94A3B8", // Placeholder, hints
          inverse:   "#FFFFFF", // Text on dark bg
        },
      },

      // ── Typography ────────────────────────────────
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      fontSize: {
        xs:   ["0.75rem",  { lineHeight: "1rem" }],
        sm:   ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem",     { lineHeight: "1.75rem" }],
        lg:   ["1.125rem", { lineHeight: "1.75rem" }],
        xl:   ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl":["1.5rem",   { lineHeight: "2rem" }],
        "3xl":["1.875rem", { lineHeight: "2.25rem" }],
        "4xl":["2.25rem",  { lineHeight: "2.5rem" }],
      },

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ── Border Radius ─────────────────────────────
      borderRadius: {
        "xl":  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      // ── Box Shadow ────────────────────────────────
      boxShadow: {
        card:  "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
        modal: "0 20px 60px -10px rgb(0 0 0 / 0.2)",
        focus: "0 0 0 3px rgb(46 109 164 / 0.3)",
      },
    },
  },

  plugins: [],
}
