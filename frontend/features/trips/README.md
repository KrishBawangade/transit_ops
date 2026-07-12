# Trips Feature Module

This folder contains components, hooks, services, and types specific to the Trips/Dispatches module of TransitOps.

## Recommended Structure

- `/components`: Renders the UI blocks like `trip-map.tsx`, `trip-dispatch-form.tsx`, `trip-timeline.tsx`.
- `/hooks`: Custom React hooks for trip tracking and live routing (e.g. `use-trips.ts`).
- `/services`: Interfaces for API calls and GPS tracking sockets (e.g. `trips-api.ts`).
- `/types`: Typescript models (e.g. `trip.ts`).

## Styling Guideline

- Import theme values from `@/lib/core/theme/theme` or use the Tailwind class extensions (e.g. `bg-info`, `rounded-m`, `shadow-card`).
- Minimize code duplication by keeping reusable elements in `lib/core/widgets`.
