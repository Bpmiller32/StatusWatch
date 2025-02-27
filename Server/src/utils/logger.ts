import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create transports array
const transports: winston.transport[] = [];

// Always log errors to error.log
transports.push(
  new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error' 
  })
);

// Log warnings and errors to combined.log
transports.push(
  new winston.transports.File({ 
    filename: 'logs/combined.log',
    level: 'warn'
  })
);

// Log warnings and errors to console
transports.push(
  new winston.transports.Console({
    level: 'warn',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: 'warn', // Only log warnings and errors
  format: logFormat,
  transports: transports
});
