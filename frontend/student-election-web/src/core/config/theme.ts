// src/core/config/theme.ts

export interface Theme {
  colors: {
    primary: string; // Indigo
    secondary: string; // Violet
    accent: string; // Cyan
    background: string; // Deep navy/charcoal
    surface: string; // Glassmorphic panel
    success: string; // Emerald
    warning: string; // Amber
    error: string; // Red
    textPrimary: string;
    textSecondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  boxShadow: string;
  fontFamily: string;
}

export const theme: Theme = {
  colors: {
    primary: '#3b82f6', // indigo-500
    secondary: '#7c3aed', // violet-600
    accent: '#06b6d4', // cyan-500
    background: '#0f172a', // slate-900
    surface: 'rgba(255,255,255,0.08)', // glass panel
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
    textPrimary: '#f1f5f9', // slate-100
    textSecondary: '#cbd5e1', // slate-300
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  fontFamily: "'Inter Variable', sans-serif",
};
