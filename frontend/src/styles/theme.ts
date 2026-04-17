/**
 * Design token values — mirrors tailwind.config.ts.
 * Use this file when you need token values outside of Tailwind classes
 * (e.g., inline canvas drawing, chart libraries, dynamic styles).
 */
export const theme = {
  colors: {
    primary: '#C0392B',
    primaryLight: '#E74C3C',
    primaryDark: '#922B21',
    secondary: '#E67E22',
    surface: '#FFFFFF',
    surfaceMuted: '#F8F8F6',
    surfaceBorder: '#E5E0D8',
    textPrimary: '#1A1A1A',
    textSecondary: '#5A5A5A',
    textMuted: '#9CA3AF',
    success: '#27AE60',
    warning: '#F1C40F',
    danger: '#E74C3C',
    info: '#2980B9',
  },
} as const