# Vehicles Feature Module

This folder contains components, hooks, services, and types specific to the Fleet/Vehicles module of TransitOps.

## Recommended Structure

- `/components`: Renders the UI blocks like `vehicle-list.tsx`, `vehicle-card.tsx`, `telematics-speedometer.tsx`.
- `/hooks`: Custom React hooks for fetching vehicle data or managing tracking state (e.g. `use-vehicles.ts`).
- `/services`: Interface with the API server, database, or WebSocket streams (e.g. `vehicles-api.ts`).
- `/types`: Typescript models (e.g. `vehicle.ts`).

## Styling Guideline

- Import theme values from `@/lib/core/theme/theme` or use the Tailwind class extensions (e.g. `bg-primary`, `rounded-m`, `shadow-card`).
- Minimize code duplication by keeping reusable elements in `lib/core/widgets`.
