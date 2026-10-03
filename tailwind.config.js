/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          orange: "#FF7A00",
          pink: "#FF4D8D",
          sky: "#29B6F6",
          green: "#22C55E",
          purple: "#9C27B0",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.14)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease",
        "slide-up": "slideUp 0.4s ease",
        "bounce-soft": "bounceSoft 0.6s ease",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSoft: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};
