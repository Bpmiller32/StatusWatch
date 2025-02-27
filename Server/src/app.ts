import express, { Request, Response, NextFunction } from 'express';
import { logger } from './utils/logger';
import statusRoutes from './routes/statusRoutes';
import healthRoutes from './routes/healthRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';

// Create Express application
export const app = express();

// Middleware
app.use(requestLogger); // Log all requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter(100, 60 * 1000)); // 100 requests per minute

// Simple route for testing
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to StatusWatch API' });
});

// API routes
app.use('/api', statusRoutes);
app.use('/api', healthRoutes);
app.use('/api', dashboardRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});
