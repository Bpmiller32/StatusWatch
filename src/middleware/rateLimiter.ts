import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Simple in-memory rate limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const requestCounts: Map<string, RateLimitRecord> = new Map();

// Default rate limit settings
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 60; // 60 requests per minute

/**
 * Rate limiter middleware factory
 * @param maxRequests Maximum number of requests allowed in the time window
 * @param windowMs Time window in milliseconds
 * @returns Express middleware function
 */
export const rateLimiter = (
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get client IP
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Get current time
    const now = Date.now();
    
    // Get or create rate limit record for this IP
    let record = requestCounts.get(clientIp);
    
    if (!record) {
      // First request from this IP
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      requestCounts.set(clientIp, record);
      return next();
    }
    
    // Check if the window has expired
    if (now > record.resetTime) {
      // Reset the counter
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    // Increment the counter
    record.count++;
    
    // Check if the rate limit has been exceeded
    if (record.count > maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${clientIp}`);
      
      // Set rate limit headers
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      
      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    // Allow the request
    next();
  };
};
