import { createTheme } from '@mui/material/styles';

/*
 * Clean Minimal Wellness Theme
 * Inspired by Yogabn: muted sage-green, warm cream canvas, clean sans-serif.
 * Rule: No decorative fonts. No oversized headings. No heavy shadows.
 */
export const colors = {
  primary: '#4F6647',       // Muted earthy sage green
  primaryDark: '#384B32',   // Deep olive/forest green (for Yogabn curve & cards)
  primaryLight: '#6B8563',
  primarySubtle: '#EDF2EC', // Very light sage tint

  secondary: '#7D8E76',    // Soft olive
  accent: '#95A68E',       // Lighter sage

  darkGreen: '#384B32',    // Exact Yogabn dark curve & community card background
  darkGreenHover: '#2A3925',

  warmAccent: '#D4A574',   // Warm terracotta for ratings
  warmSubtle: '#FDF8F3',   // Cream tint

  success: '#4F6647',
  whatsapp: '#25D366',
  error: '#D94F4F',

  // Backgrounds — warm cream canvas, never sterile white
  bgCream: '#F8F5F0',      // Main page canvas (warm cream/linen like Yogabn)
  bgSage: '#EEF2EC',       // Soft sage sections
  bgWhite: '#FFFFFF',      // Cards only
  white: '#FFFFFF',

  // Typography — dark charcoal, never pure black
  textDark: '#242B23',
  textMuted: '#586256',
  textLight: '#7A8478',

  // Borders
  border: '#E6E4DD',
  borderSubtle: 'rgba(0,0,0,0.06)',
};

export const gradientBrand = `linear-gradient(135deg, #5B7553 0%, #7A9970 100%)`;
export const gradientPrimary = gradientBrand;
export const gradientHero = `linear-gradient(180deg, #EEF2EC 0%, #F5F0EB 100%)`;

const theme = createTheme({
  palette: {
    primary: { main: colors.primary, dark: colors.primaryDark, light: colors.primaryLight },
    secondary: { main: colors.secondary },
    success: { main: colors.success },
    background: { default: colors.bgCream, paper: colors.white },
    text: { primary: colors.textDark, secondary: colors.textLight },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontWeight: 700, color: colors.textDark, letterSpacing: '-0.01em', lineHeight: 1.2 },
    h2: { fontWeight: 700, color: colors.textDark, letterSpacing: '-0.01em', lineHeight: 1.25 },
    h3: { fontWeight: 600, color: colors.textDark },
    h4: { fontWeight: 600, color: colors.textDark },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          padding: '10px 24px',
          fontSize: '0.88rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            height: 0,
          },
        },
        body: {
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            height: 0,
          },
        },
        '*': {
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            height: 0,
          },
        },
      },
    },
  },
});

export default theme;
