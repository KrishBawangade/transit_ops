/**
 * Border radius tokens for buttons, cards, dialogs, and inputs.
 */
export const radius = {
  small: '8px',
  medium: '12px',
  large: '16px',
  xl: '20px',
  circular: '9999px',
} as const;

export type RadiusType = typeof radius;
