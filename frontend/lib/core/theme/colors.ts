/**
 * Centralized color tokens for the TransitOps design system.
 * 
 * Maps color values to Semantic roles (Primary, Secondary, Success, Neutral, etc.)
 */
export const colors = {
  // Brand Colors
  primary: '#2563EB',      // Primary brand color (Blue 600)
  primaryLight: '#EFF6FF', // Hover states, primary badges (Blue 50)
  
  secondary: '#0F766E',    // Dark teal accent (Teal 700)
  secondaryLight: '#F0FDFA', // Light teal container/backgrounds (Teal 50)

  // Status Colors
  success: '#16A34A',      // Success alerts, active state (Green 600)
  successLight: '#DCFCE7', // Success badge background (Green 50)

  warning: '#F59E0B',      // Warning alerts, pending state (Amber 500)
  warningLight: '#FEF3C7', // Warning badge background (Amber 50)

  error: '#DC2626',        // Error alerts, offline/critical (Red 600)
  errorLight: '#FEE2E2',   // Error badge background (Red 50)

  info: '#0284C7',         // Info notes, generic announcements (Sky 600)
  infoLight: '#E0F2FE',    // Info badge background (Sky 50)

  // Neutral Colors (Light Theme First)
  background: '#F8FAFC',   // Main dashboard canvas background (Slate 50)
  surface: '#FFFFFF',      // Cards, dialogs, main container surfaces (White)
  border: '#E5E7EB',       // Subtle borders around cards/inputs (Gray 200)
  divider: '#CBD5E1',      // Table row dividers, subtle lines (Slate 300)

  // Text Colors
  textPrimary: '#111827',    // Headers, main body copy (Gray 900)
  textSecondary: '#6B7280',  // Captions, subtitles, descriptions (Gray 500)
  textMuted: '#9CA3AF',      // Placeholders, disabled states (Gray 400)
  textOnPrimary: '#FFFFFF',  // Text on primary brand background (White)

  // Additional Slate/Gray Tones (Useful for precise Dashboard styling)
  gray50: '#F9FAFB',       // Highlighted rows, input background (Gray 50)
  gray100: '#F3F4F6',      // Background of hover/secondary buttons (Gray 100)
  gray300: '#D1D5DB',      // Scrollbars, standard disabled text (Gray 300)
  gray800: '#1F2937',      // Dark components like snackbars/tooltips (Gray 800)
  gray900: '#111827',      // Deep dark headers/tooltips (Gray 900)
} as const;

export type ColorsType = typeof colors;
