# Drivers Feature Module

This folder contains components, hooks, services, and types specific to the Drivers/Operators module of TransitOps.

## Recommended Structure

- `/components`: Renders the UI blocks like `driver-roster.tsx`, `driver-detail-card.tsx`, `safety-stats.tsx`.
- `/hooks`: Custom React hooks for driver management (e.g. `use-drivers.ts`).
- `/services`: Interfaces for database read/write and driver activity sync (e.g. `drivers-api.ts`).
- `/types`: Typescript models (e.g. `driver.ts`).

## Styling Guideline

- Import theme values from `@/lib/core/theme/theme` or use the Tailwind class extensions (e.g. `bg-secondary`, `rounded-m`, `shadow-card`).
- Minimize code duplication by keeping reusable elements in `lib/core/widgets`.
