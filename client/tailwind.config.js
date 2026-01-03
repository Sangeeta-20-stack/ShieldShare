export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        card: "rgba(255,255,255,0.08)",
        accent: "#00E5FF",
        success: "#00FF9C",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 25px rgba(0,229,255,0.25)",
        success: "0 0 25px rgba(0,255,156,0.35)",
      },
    },
  },
  plugins: [],
};
