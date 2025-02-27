import { Request, Response } from 'express';
import { getLatestStatusLog, getStatusLogs } from '../utils/firestore';
import { logger } from '../utils/logger';

// Standard response format
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}

// Create a standard API response
const createResponse = <T>(
  success: boolean,
  data: T | null = null,
  error: string | null = null
): ApiResponse<T> => {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  };
};

// Get latest ping status
export const getPingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const latestLog = await getLatestStatusLog();
    
    if (!latestLog) {
      res.status(404).json(createResponse(false, null, 'No status logs found'));
      return;
    }
    
    res.json(createResponse(true, {
      timestamp: latestLog.timestamp,
      pingResults: latestLog.pingResults
    }));
  } catch (error) {
    logger.error('Error getting ping status:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
};

// Get ping status list
export const getPingList = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const startAfter = req.query.startAfter ? new Date(req.query.startAfter as string) : undefined;
    
    const logs = await getStatusLogs(limit, startAfter);
    
    res.json(createResponse(true, logs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      pingResults: log.pingResults
    }))));
  } catch (error) {
    logger.error('Error getting ping list:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
};

// Get latest log check status
export const getLogCheckStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const latestLog = await getLatestStatusLog();
    
    if (!latestLog) {
      res.status(404).json(createResponse(false, null, 'No status logs found'));
      return;
    }
    
    res.json(createResponse(true, {
      timestamp: latestLog.timestamp,
      logCheck: latestLog.logCheck
    }));
  } catch (error) {
    logger.error('Error getting log check status:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
};

// Get log check list
export const getLogCheckList = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const startAfter = req.query.startAfter ? new Date(req.query.startAfter as string) : undefined;
    
    const logs = await getStatusLogs(limit, startAfter);
    
    res.json(createResponse(true, logs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      logCheck: log.logCheck
    }))));
  } catch (error) {
    logger.error('Error getting log check list:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
};

// Get full status (both ping and log check)
export const getFullStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const latestLog = await getLatestStatusLog();
    
    if (!latestLog) {
      res.status(404).json(createResponse(false, null, 'No status logs found'));
      return;
    }
    
    // Determine if all ping responses are passing (status code 200-299)
    const allPingsSuccessful = latestLog.pingResults.every(
      result => result.status >= 200 && result.status < 300
    );
    
    // Determine if log check is passing
    const logCheckSuccessful = latestLog.logCheck.success;
    
    // Determine overall status
    let status: 'up' | 'partiallyUp' | 'down';
    
    if (allPingsSuccessful && logCheckSuccessful) {
      status = 'up';
    } else if (allPingsSuccessful || logCheckSuccessful) {
      status = 'partiallyUp';
    } else {
      status = 'down';
    }
    
    // Add status to the response
    const responseData = {
      ...latestLog,
      status
    };
    
    res.json(createResponse(true, responseData));
  } catch (error) {
    logger.error('Error getting full status:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
};
