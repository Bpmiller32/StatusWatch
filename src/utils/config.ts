import fs from 'fs';
import path from 'path';
import { logger } from './logger';

// Interface for endpoint configuration
export interface EndpointConfig {
  url: string;
  name: string;
}

// Interface for application configuration
export interface Configuration {
  pingInterval: string; // Cron expression
  endpoints: EndpointConfig[];
  logFilePath: string;
  dataRetentionDays: number;
  port: number;
}

// Default configuration
export const defaultConfiguration: Configuration = {
  pingInterval: '*/5 * * * * *', // Every 5 seconds
  endpoints: [
    { url: 'https://google.com', name: 'Google' },
    { url: 'https://example.com', name: 'Example' }
  ],
  logFilePath: '/path/to/logs/server.log',
  dataRetentionDays: 3,
  port: parseInt(process.env.PORT || '3000', 10)
};

// Configuration instance
let configuration: Configuration = { ...defaultConfiguration };

/**
 * Load configuration from file
 * @param configPath Path to configuration file
 * @returns Configuration object
 */
export const loadConfiguration = (configPath: string = path.join(process.cwd(), 'config.json')): Configuration => {
  try {
    // Check if file exists
    if (!fs.existsSync(configPath)) {
      logger.warn(`Configuration file not found: ${configPath}, using default configuration`);
      return defaultConfiguration;
    }
    
    // Read file
    const configData = fs.readFileSync(configPath, 'utf8');
    
    // Parse JSON
    const parsedConfig = JSON.parse(configData);
    
    // Merge with default configuration
    configuration = {
      ...defaultConfiguration,
      ...parsedConfig
    };
    
    logger.info('Configuration loaded successfully');
    
    return configuration;
  } catch (error) {
    logger.error('Error loading configuration:', error);
    return defaultConfiguration;
  }
};

/**
 * Get current configuration
 * @returns Configuration object
 */
export const getConfiguration = (): Configuration => {
  return configuration;
};

/**
 * Update configuration and save to file
 * @param updates Partial configuration updates
 * @param configPath Path to configuration file
 * @returns Updated configuration
 */
export const updateConfiguration = (
  updates: Partial<Configuration>,
  configPath: string = path.join(process.cwd(), 'config.json')
): Configuration => {
  try {
    // Update configuration
    configuration = {
      ...configuration,
      ...updates
    };
    
    // Write to file
    fs.writeFileSync(configPath, JSON.stringify(configuration, null, 2), 'utf8');
    
    logger.info('Configuration updated successfully');
    
    return configuration;
  } catch (error) {
    logger.error('Error updating configuration:', error);
    throw error;
  }
};
