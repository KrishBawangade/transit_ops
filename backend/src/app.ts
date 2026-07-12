import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app: Application = express();

// Enable CORS with default settings
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Built-in body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core API Router
const apiRouter = express.Router();

// Health Check Endpoint (GET /api/health)
apiRouter.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TransitOps Backend API',
    uptime: `${Math.floor(process.uptime())}s`
  });
});

// Apply global API prefix
app.use('/api', apiRouter);

// Global 404 handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
