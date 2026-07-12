# TransitOps – Smart Transport Operations Platform

Welcome to **TransitOps**, a production-grade fleet management and logistics coordination platform. This project is structured as a monorepo consisting of an Express + TypeScript REST API (backend) and a Next.js (app router) + TypeScript web application (frontend).

---

## 🏗️ Project Architecture

TransitOps is divided into two primary workspaces:
1. **[backend/](file:///c:/Users/jatin/transit_ops/backend)**: Powering the business logic, route scheduling, and database access.
2. **[frontend/](file:///c:/Users/jatin/transit_ops/frontend)**: A rich, interactive user interface providing real-time data visualisations, driver registrations, and compliance logs.

```
transit_ops/
├── backend/            # Express + TypeScript + Prisma API
│   ├── prisma/         # Database schemas & migrations
│   └── src/            # Application source code
└── frontend/           # Next.js App Router SPA/Dashboard
    ├── app/            # Next.js page layouts & routes
    ├── features/       # Modular frontend pages/dashboards
    └── lib/            # Shared utilities and API services
```

---

## 🛠️ Technology Stack

### Backend
* **Runtime & Language**: Node.js, TypeScript
* **Web Framework**: Express
* **Database ORM**: Prisma client
* **Database Engine**: PostgreSQL (Neon Cloud)
* **Data Validation**: Schemas (e.g., Zod)
* **Architecture Pattern**: *Feature + Layer Hybrid Architecture* (Express Route ➔ Controller ➔ Validation ➔ Service ➔ Repository ➔ Prisma ➔ PostgreSQL)

### Frontend
* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **State & Caching**: Custom SVR (Stale-While-Revalidate) caching with session storage
* **Authentication**: Token-based authentication with automatic 401 token mismatch self-healing and loading gate mechanisms.
* **Styling**: Vanilla CSS with modern typography and animations

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js (v18+)](https://nodejs.org)
* [npm](https://www.npmjs.com/) or similar package manager
* Access to a PostgreSQL database (e.g. [Neon Database Console](https://neon.tech/))

---

### Setup Backend

1. Navigate to the backend workspace:
   ```bash
   cd backend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Prepare configuration:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to configure your connection strings:*
   * `DATABASE_URL`: Pooled connection string (for running the app).
   * `DIRECT_URL`: Direct connection string (required to run migrations).

4. Run database migrations and generate the client:
   ```bash
   npm run prisma:migrate
   ```
5. Seed database with initial fleet, user, and commercial driver data:
   ```bash
   npm run prisma:seed
   ```
6. Start the local API server in development mode:
   ```bash
   npm run dev
   ```

Refer to the **[backend/README.md](file:///c:/Users/jatin/transit_ops/backend/README.md)** for further instructions on production builds and API structure.

---

### Setup Frontend

1. Navigate to the frontend workspace:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the web dashboard at `http://localhost:3000`.

Refer to the **[frontend/README.md](file:///c:/Users/jatin/transit_ops/frontend/README.md)** for additional customization instructions.

---

## ✨ Features Implemented

* **Feature + Layer hybrid backend architecture**: Clean separation of routes, validation schemas, controllers, business services, and data repositories.
* **Driver Management**: Register new commercial drivers, list active profiles, and manage metadata.
* **Advanced Caching**: Highly optimized `sessionStorage` fallback with Stale-While-Revalidate pattern for instantaneous driver layout rendering.
* **Self-Healing Auth**: Front-end routing handles invalidation, 401 token drift, and redirects gracefully to login screens using custom Next.js middleware / loading gates.
* **Seed Engine**: Seeding script featuring full support for up to 8 diverse commercial drivers and mock metrics.
