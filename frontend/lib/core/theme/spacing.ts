/**
 * Spacing constants based on an 8-point system for TransitOps layout grids and elements.
 */
export const spacing = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  xxl: '32px',
  xxxl: '40px',
  huge: '48px',
  massive: '64px',
} as const;

export type SpacingType = typeof spacing;
