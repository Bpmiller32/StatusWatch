import cron from 'node-cron';
import { logger } from '../utils/logger';
import { getConfiguration } from '../utils/config';
import { addStatusLog, deleteOldStatusLogs } from '../utils/firestore';
import { pingEndpoints } from './ping/pingService';
import { checkLogFile } from './logs/logMonitorService';
import { LogCheckResult } from '../models/StatusLog';

// Track if a task is already running
let isTaskRunning = false;

/**
 * Run the monitoring task
 */
export const runMonitoringTask = async (): Promise<void> => {
  // Prevent overlapping executions
  if (isTaskRunning) {
    logger.warn('Previous monitoring task still running, skipping this execution');
    return;
  }
  
  isTaskRunning = true;
  
  try {
    logger.info('Starting monitoring task');
    
    // Get configuration
    const config = await getConfiguration();
    
    // Run ping checks
    const pingResults = await pingEndpoints(config.endpoints);
    
    // Run log file check
    const logCheckResult: LogCheckResult = await checkLogFile(config.logFilePath);
    
    // Store results in Firestore
    await addStatusLog({
      pingResults,
      logCheck: logCheckResult
    });
    
    logger.info('Monitoring task completed successfully');
  } catch (error) {
    logger.error('Error in monitoring task:', error);
  } finally {
    isTaskRunning = false;
  }
};

/**
 * Run the data retention task
 */
export const runDataRetentionTask = async (): Promise<void> => {
  try {
    logger.info('Starting data retention task');
    
    // Get configuration
    const config = await getConfiguration();
    
    // Delete old status logs
    const deletedCount = await deleteOldStatusLogs(config.dataRetentionDays);
    
    logger.info(`Data retention task completed: deleted ${deletedCount} old logs`);
  } catch (error) {
    logger.error('Error in data retention task:', error);
  }
};

// Scheduled tasks
let monitoringTask: cron.ScheduledTask | null = null;
let dataRetentionTask: cron.ScheduledTask | null = null;

/**
 * Start the scheduled tasks
 */
export const startScheduledTasks = async (): Promise<void> => {
  try {
    // Get configuration
    const config = await getConfiguration();
    
    // Schedule monitoring task
    if (monitoringTask) {
      monitoringTask.stop();
    }
    
    monitoringTask = cron.schedule(config.pingInterval, runMonitoringTask);
    logger.info(`Scheduled monitoring task with interval: ${config.pingInterval}`);
    
    // Schedule data retention task (daily at midnight)
    if (dataRetentionTask) {
      dataRetentionTask.stop();
    }
    
    dataRetentionTask = cron.schedule('0 0 * * *', runDataRetentionTask);
    logger.info('Scheduled data retention task to run daily at midnight');
    
    // Run tasks immediately on startup
    await runMonitoringTask();
    await runDataRetentionTask();
  } catch (error) {
    logger.error('Error starting scheduled tasks:', error);
  }
};

/**
 * Stop the scheduled tasks
 */
export const stopScheduledTasks = (): void => {
  if (monitoringTask) {
    monitoringTask.stop();
    monitoringTask = null;
    logger.info('Stopped monitoring task');
  }
  
  if (dataRetentionTask) {
    dataRetentionTask.stop();
    dataRetentionTask = null;
    logger.info('Stopped data retention task');
  }
};
