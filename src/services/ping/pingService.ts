import axios, { AxiosResponse } from 'axios';
import { logger } from '../../utils/logger';
import { PingResult } from '../../models/StatusLog';
import { EndpointConfig } from '../../utils/config';

// Maximum number of retry attempts
const MAX_RETRIES = 3;

// Timeout for ping requests in milliseconds
const TIMEOUT = 5000;

/**
 * Ping a single endpoint with retry logic
 * @param endpoint The endpoint configuration
 * @returns Promise with ping result
 */
export const pingEndpoint = async (endpoint: EndpointConfig): Promise<PingResult> => {
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries < MAX_RETRIES) {
    try {
      const startTime = Date.now();
      
      // Make the request
      const response: AxiosResponse = await axios.get(endpoint.url, {
        timeout: TIMEOUT,
        validateStatus: () => true // Don't throw on error status codes
      });
      
      const responseTime = Date.now() - startTime;
      
      logger.debug(`Pinged ${endpoint.name} (${endpoint.url}): ${response.status} in ${responseTime}ms`);
      
      return {
        endpoint: endpoint.url,
        status: response.status,
        responseTime
      };
    } catch (error) {
      lastError = error as Error;
      retries++;
      
      logger.warn(`Ping attempt ${retries} failed for ${endpoint.name} (${endpoint.url}): ${lastError.message}`);
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
  
  // All retries failed
  logger.error(`All ping attempts failed for ${endpoint.name} (${endpoint.url})`);
  
  return {
    endpoint: endpoint.url,
    status: 0, // 0 indicates connection failure
    responseTime: -1
  };
};

/**
 * Ping multiple endpoints in parallel
 * @param endpoints Array of endpoint configurations
 * @returns Promise with array of ping results
 */
export const pingEndpoints = async (endpoints: EndpointConfig[]): Promise<PingResult[]> => {
  logger.info(`Pinging ${endpoints.length} endpoints`);
  
  try {
    // Run all pings in parallel
    const pingPromises = endpoints.map(endpoint => pingEndpoint(endpoint));
    const results = await Promise.all(pingPromises);
    
    logger.info('Ping task completed successfully');
    return results;
  } catch (error) {
    logger.error('Error in ping task:', error);
    throw error;
  }
};
