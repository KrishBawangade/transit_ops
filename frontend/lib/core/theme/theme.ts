import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';
import { typography } from './typography';

/**
 * Unified TransitOps Design System theme object for Next.js.
 */
export const theme = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
} as const;

export type ThemeType = typeof theme;
export { colors, spacing, radius, shadows, typography };
