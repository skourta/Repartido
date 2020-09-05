// tailwind.config.js
const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
   extend:{
    colors: {
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      accent: "var(--accent)",
      danger: "var(--danger)",
      back: {
        300: "var(--back-light)",
        500: "var(--back)"
      },
    }
   }
  },
  variants: {},
  plugins: [],
  future:{
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  }
}
