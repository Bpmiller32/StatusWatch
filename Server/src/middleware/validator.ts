import { Request, Response, NextFunction, RequestHandler } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to validate request body against a schema
 * @param schema Validation schema function
 * @returns Express middleware function
 */
export const validateBody = (schema: (body: any) => { valid: boolean; errors: string[] }): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { valid, errors } = schema(req.body);
    
    if (!valid) {
      logger.warn(`Request validation failed: ${errors.join(', ')}`);
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Validation failed',
        errors
      });
      return;
    }
    
    next();
  };
};

/**
 * Validate configuration update request
 * @param body Request body
 * @returns Validation result
 */
export const validateConfigUpdate = (body: any) => {
  const errors: string[] = [];
  
  // Check if body is an object
  if (typeof body !== 'object' || body === null) {
    return { valid: false, errors: ['Request body must be an object'] };
  }
  
  // Validate pingInterval if provided
  if (body.pingInterval !== undefined) {
    if (typeof body.pingInterval !== 'string') {
      errors.push('pingInterval must be a string');
    } else {
      try {
        // Simple validation - node-cron will throw if invalid
        require('node-cron').validate(body.pingInterval);
      } catch {
        errors.push('pingInterval must be a valid cron expression');
      }
    }
  }
  
  // Validate endpoints if provided
  if (body.endpoints !== undefined) {
    if (!Array.isArray(body.endpoints)) {
      errors.push('endpoints must be an array');
    } else {
      body.endpoints.forEach((endpoint: any, index: number) => {
        if (typeof endpoint !== 'object' || endpoint === null) {
          errors.push(`endpoints[${index}] must be an object`);
        } else {
          if (typeof endpoint.url !== 'string') {
            errors.push(`endpoints[${index}].url must be a string`);
          }
          if (typeof endpoint.name !== 'string') {
            errors.push(`endpoints[${index}].name must be a string`);
          }
        }
      });
    }
  }
  
  // Validate logFilePath if provided
  if (body.logFilePath !== undefined && typeof body.logFilePath !== 'string') {
    errors.push('logFilePath must be a string');
  }
  
  // Validate dataRetentionDays if provided
  if (body.dataRetentionDays !== undefined) {
    if (typeof body.dataRetentionDays !== 'number') {
      errors.push('dataRetentionDays must be a number');
    } else if (body.dataRetentionDays < 1 || body.dataRetentionDays > 30) {
      errors.push('dataRetentionDays must be between 1 and 30');
    }
  }
  
  // Validate port if provided
  if (body.port !== undefined) {
    if (typeof body.port !== 'number') {
      errors.push('port must be a number');
    } else if (body.port < 1024 || body.port > 65535) {
      errors.push('port must be between 1024 and 65535');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
