import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Design Tokens ───────────────────────────────────────────────────────
      // DO NOT use raw hex values in components. Use these semantic tokens.
      colors: {
        primary: {
          DEFAULT: '#C0392B',   // Đỏ gà — brand red
          light: '#E74C3C',
          dark: '#922B21',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#E67E22',   // Cam đất — warm amber
          light: '#F39C12',
          dark: '#D35400',
          foreground: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8F8F6',     // Warm off-white background
          border: '#E5E0D8',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#5A5A5A',
          muted: '#9CA3AF',
          inverse: '#FFFFFF',
        },
        success: { DEFAULT: '#27AE60', foreground: '#FFFFFF' },
        warning: { DEFAULT: '#F1C40F', foreground: '#1A1A1A' },
        danger:  { DEFAULT: '#E74C3C', foreground: '#FFFFFF' },
        info:    { DEFAULT: '#2980B9', foreground: '#FFFFFF' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
        btn: '0.5rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
}

export default config