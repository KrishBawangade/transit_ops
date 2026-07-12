import dotenv from 'dotenv';
// Load environment variables before initializing the app
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 TransitOps Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});

// Handle Graceful Shutdown
const shutdown = (signal: string) => {
  console.log(`\n[${signal}] Shutdown signal received. Closing HTTP server...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
