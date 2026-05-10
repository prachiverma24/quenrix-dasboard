/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        purple: {
          950: "#0F0C29",
          900: "#1B1333",
          850: "#1e1640",
          800: "#2A1E5C",
          700: "#3B2D7A",
          600: "#5B3FA0",
          500: "#7C5CFF",
          400: "#A78BFA",
          300: "#C4B5FD",
        },
      },
      backgroundImage: {
        "main-gradient": "linear-gradient(135deg, #0F0C29, #1B1333, #2A1E5C)",
        "btn-gradient": "linear-gradient(135deg, #7C5CFF, #A78BFA)",
        "active-gradient": "linear-gradient(135deg, rgba(124,92,255,0.35), rgba(167,139,250,0.2))",
        "card-glow": "linear-gradient(135deg, rgba(124,92,255,0.15), rgba(167,139,250,0.05))",
        "ai-gradient": "linear-gradient(135deg, rgba(91,63,160,0.5), rgba(59,45,122,0.6))",
      },
      boxShadow: {
        glass: "0 8px 30px rgba(0,0,0,0.3)",
        glow: "0 0 20px rgba(124,92,255,0.3)",
        "glow-sm": "0 0 10px rgba(124,92,255,0.2)",
        btn: "0 4px 15px rgba(124,92,255,0.5)",
      },
      backdropBlur: {
        glass: "10px",
      },
      borderRadius: {
        xl2: "16px",
        xl3: "20px",
        xl4: "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease",
        "slide-up": "slideUp 0.4s ease",
        pulse2: "pulse2 2s infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
