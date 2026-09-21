import { createTheme } from "@mui/material/styles";

// Matches the approved design's color palette exactly
export const colors = {
  primary: "#79985b", // Signature olive/sage green (pill buttons, badges)
  primaryDark: "#55723b", // Hover & pressed green
  secondary: "#a3bc88", // Soft sage accent
  accent: "#c99a4e", // Warm golden touch for stars/highlights
  success: "#2e7d32",
  forest: "#2d4224", // Deep forest green
  whatsapp: "#25D366",
  bgLight: "#fbfbf9", // Off-white / linen background
  textDark: "#1b2419", // Deep botanical charcoal for high contrast headings & text
  textLight: "#5c6858", // Muted olive-gray for secondary text
  border: "#e4e8df", // Gentle organic border
  bgCard: "#ffffff",
  darkBg: "#0f1710", // Rich dark forest background for Hero overlay, CTA & Footer
  darkBgElevated: "#172218",
  white: "#ffffff",
};

export const serifFont =
  "'Playfair Display', Georgia, 'Times New Roman', serif";
export const sansFont =
  "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const gradientPrimary = `linear-gradient(135deg, ${colors.forest} 0%, ${colors.primary} 100%)`;
export const gradientBrand = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      contrastText: "#ffffff",
    },
    secondary: { main: colors.secondary, contrastText: "#1b2419" },
    success: { main: colors.success },
    background: { default: colors.bgLight, paper: colors.white },
    text: { primary: colors.textDark, secondary: colors.textLight },
  },
  typography: {
    fontFamily: sansFont,
    h1: {
      fontFamily: serifFont,
      fontWeight: 600,
      letterSpacing: "-0.02em",
      color: colors.textDark,
    },
    h2: {
      fontFamily: serifFont,
      fontWeight: 600,
      letterSpacing: "-0.015em",
      color: colors.textDark,
    },
    h3: {
      fontFamily: serifFont,
      fontWeight: 600,
      color: colors.textDark,
    },
    h4: {
      fontFamily: serifFont,
      fontWeight: 600,
      color: colors.textDark,
    },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Elegant pill shape from the mockup
          padding: "10px 24px",
          fontSize: "0.92rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(121, 152, 91, 0.25)",
          },
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          color: "#ffffff",
          "&:hover": {
            backgroundColor: colors.primaryDark,
          },
        },
        outlinedPrimary: {
          borderColor: colors.primary,
          color: colors.primary,
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            backgroundColor: "rgba(121, 152, 91, 0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
