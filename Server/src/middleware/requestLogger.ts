import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to log API requests and response times
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Get start time
  const start = Date.now();
  
  // Log request
  logger.info(`${req.method} ${req.url}`);
  
  // Add response listener
  res.on('finish', () => {
    // Calculate response time
    const responseTime = Date.now() - start;
    
    // Log response
    logger.info(`${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`);
  });
  
  // Continue to next middleware
  next();
};
