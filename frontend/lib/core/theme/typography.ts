/**
 * Typography hierarchy tokens based on standard Material 3 layouts, styled with Inter.
 */
export const typography = {
  fontFamily: 'Inter, system-ui, sans-serif',
  styles: {
    displayLarge: {
      fontSize: '57px',
      fontWeight: '700',
      lineHeight: '64px',
      letterSpacing: '-0.25px',
    },
    displayMedium: {
      fontSize: '45px',
      fontWeight: '700',
      lineHeight: '52px',
      letterSpacing: '-0.25px',
    },
    headlineLarge: {
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '40px',
      letterSpacing: '-0.2px',
    },
    headlineMedium: {
      fontSize: '28px',
      fontWeight: '600',
      lineHeight: '36px',
      letterSpacing: '-0.2px',
    },
    titleLarge: {
      fontSize: '22px',
      fontWeight: '600',
      lineHeight: '28px',
      letterSpacing: '-0.1px',
    },
    titleMedium: {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '24px',
      letterSpacing: '0.1px',
    },
    bodyLarge: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      letterSpacing: '0.15px',
    },
    bodyMedium: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      letterSpacing: '0.15px',
    },
    bodySmall: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '16px',
      letterSpacing: '0.1px',
    },
    labelLarge: {
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
    labelMedium: {
      fontSize: '12px',
      fontWeight: '600',
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
  },
} as const;

export type TypographyType = typeof typography;
export type TypographyStyleName = keyof typeof typography.styles;
