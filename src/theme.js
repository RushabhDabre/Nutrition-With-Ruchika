import { createTheme } from '@mui/material/styles';

// Matches the approved design's color palette exactly
export const colors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#ec4899',
  accent: '#8b5cf6',
  success: '#10b981',
  whatsapp: '#25D366',
  bgLight: '#f8fafc',
  textDark: '#1e293b',
  textLight: '#64748b',
  border: '#e2e8f0',
  white: '#ffffff',
};

export const gradientPrimary = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`;
export const gradientBrand = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;

const theme = createTheme({
  palette: {
    primary: { main: colors.primary, dark: colors.primaryDark },
    secondary: { main: colors.secondary },
    success: { main: colors.success },
    background: { default: colors.white, paper: colors.white },
    text: { primary: colors.textDark, secondary: colors.textLight },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '11px 24px', fontSize: '0.92rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `2px solid ${colors.border}`,
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
