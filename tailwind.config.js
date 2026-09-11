/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          porcelain: "#FAF7F2", // Furnishka warm background
          cream: "#F4EFE6",
          sand: "#EAE3D2",
          sandDark: "#D8CDBC",
          charcoal: "#1F1A17", // Primary dark text
          espresso: "#2C221E",
          walnut: "#4A3B32",
          terracotta: "#C86A3B", // Warm accent
          terracottaDark: "#A85328",
          amber: "#D97706",
          amberLight: "#FEF3C7",
          forest: "#2D4A3E", // Elegant accent
          forestLight: "#E8F0EC",
          sage: "#5B7065",
          clay: "#A2482B",
          muted: "#786F66",
        },
        // Backwards compatible aliases
        cream: "#FAF7F2",
        walnut: "#1F1A17",
        walnut2: "#4A3B32",
        mustard: "#D97706",
        mustardDark: "#C86A3B",
        forest: "#2D4A3E",
        clay: "#A2482B",
        sand: "#EAE3D2",
      },
      fontFamily: {
        display: ["Fraunces", "Playfair Display", "Georgia", "serif"],
        body: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        nav: ["Outfit", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(31, 26, 23, 0.04)",
        card: "0 4px 20px rgba(31, 26, 23, 0.06)",
        cardHover: "0 12px 32px rgba(31, 26, 23, 0.12)",
        drawer: "-8px 0 30px rgba(31, 26, 23, 0.15)",
        floating: "0 10px 40px -10px rgba(31, 26, 23, 0.2)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
