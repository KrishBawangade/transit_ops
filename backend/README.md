# TransitOps – Smart Transport Operations Platform (Backend)

TransitOps Backend is a production-grade Express + TypeScript API powered by PostgreSQL and Prisma ORM.

## Architecture

This project uses a **Feature + Layer Hybrid Architecture** designed to scale.

### Layer Request Flow
```
Express Route ➔ Controller ➔ Validation ➔ Service ➔ Repository ➔ Prisma ➔ PostgreSQL
```

- **Express Route**: Entrypoint defining routes and applying middleware.
- **Controller**: Ultra-thin layer responsible for extracting request data and sending responses.
- **Validation**: Ensures inbound data satisfies type and business schemas before proceeding.
- **Service**: Houses all business logic. Service modules do not query the database directly.
- **Repository**: Single source of database operations. Repositories should only communicate with Prisma.
- **Prisma**: Object-Relational Mapping (ORM) client.
- **PostgreSQL**: Relational database storage.

---

## Folder Structure

```
backend/
│
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # SQL migration history files
│
├── src/
│   ├── config/                # Environment, third-party libraries config
│   │
│   ├── features/              # Feature modules (Feature + Layer hybrid pattern)
│   │   ├── dashboard/         # Dashboard analytics & statistics
│   │   ├── vehicles/          # Vehicle registration and states
│   │   ├── drivers/           # Driver profiles, shift assignments
│   │   ├── trips/             # Route scheduling & dispatching
│   │   ├── maintenance/       # Service logs & scheduling
│   │   ├── fuel/              # Fuel purchase records
│   │   ├── expenses/          # Operational costs (toll, tax, repairs)
│   │   ├── reports/           # Business intelligence data exports
│   │   ├── auth/              # Authentication modules
│   │   └── users/             # User profiles & management
│   │
│   ├── shared/                # Code shared across multiple features
│   │   ├── database/          # Prisma database client singleton setup
│   │   ├── middleware/        # Shared middleware (auth, logging, error handlers)
│   │   ├── errors/            # Custom application error classes (AppError)
│   │   ├── utils/             # General utility functions
│   │   ├── validators/        # Standard schema validators (e.g. Zod/Joi)
│   │   ├── types/             # Common TypeScript interface/types definitions
│   │   ├── constants/         # Magic numbers, static lists, error strings
│   │   └── responses/         # Standard response wrappers
│   │
│   ├── routes/                # Centralized global routing registrations
│   │
│   ├── app.ts                 # Express application setup
│   └── server.ts              # Server execution entrypoint
│
├── .env                       # Local environment secrets (ignored by git)
├── .env.example               # Shared template for environment configuration
├── .gitignore                 # Files excluded from git tracking
├── package.json               # Dependencies and scripts definitions
├── tsconfig.json              # TypeScript compiler configuration
└── README.md                  # Project documentation
```

### Feature Module Substructure
Within every folder in `src/features/` (e.g., `src/features/vehicles/`), the following layer-specific files are located:
- `<feature>.controller.ts`
- `<feature>.service.ts`
- `<feature>.repository.ts`
- `<feature>.routes.ts`
- `<feature>.validation.ts`

---

## How to Install

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
   *Ensure you update the `DATABASE_URL` and `DIRECT_URL` in `.env` to match your Neon Cloud PostgreSQL database configuration.*


---

## How to Run

### Development Mode
Start the development server with hot-reloading (transpiles TypeScript on the fly):
```bash
npm run dev
```

### Production Mode
1. Build the production application (compiles TypeScript to JavaScript in `dist/`):
   ```bash
   npm run build
   ```

2. Start the production build:
   ```bash
   npm run start
   ```

---

## Prisma Database Operations

### 1. Generating Prisma Client
Generate the client after installing dependencies or updating the Prisma schema:
```bash
npm run prisma:generate
```

### 2. Creating & Running Migrations
To create and apply a migration after editing `prisma/schema.prisma`:
```bash
npm run prisma:migrate
```
*Note: Make sure your `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) are set in your `.env` file. The direct URL is required to execute schema migrations successfully against pooled Neon databases.*
