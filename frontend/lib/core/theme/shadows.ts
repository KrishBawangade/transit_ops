/**
 * Soft modern shadows optimized for web-based SaaS dashboard layouts.
 * Avoids heavy elevation-heavy shadows.
 */
export const shadows = {
  small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  card: '0 1px 3px 0 rgba(15, 23, 42, 0.02), 0 4px 6px -1px rgba(15, 23, 42, 0.06)',
  menu: '0 4px 6px -2px rgba(0, 0, 0, 0.04), 0 10px 15px -3px rgba(0, 0, 0, 0.08)',
  dialog: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 25px 50px -12px rgba(0, 0, 0, 0.12)',
  sidebar: '1px 0 2px 0 rgba(15, 23, 42, 0.02), 4px 0 10px -2px rgba(15, 23, 42, 0.06)',
  focus: '0 0 0 2px rgba(37, 99, 235, 0.24)',
} as const;

export type ShadowsType = typeof shadows;
