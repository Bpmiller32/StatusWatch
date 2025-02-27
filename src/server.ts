import dotenv from 'dotenv';
import { app } from './app';
import { logger } from './utils/logger';
import { initializeFirebase } from './config/firebase';
import { loadConfiguration, getConfiguration } from './utils/config';
import { startScheduledTasks, stopScheduledTasks } from './services/taskScheduler';

// Load environment variables
dotenv.config();

// Initialize Firebase
initializeFirebase();

// Load configuration from file
loadConfiguration();

const startServer = async () => {
  try {
    // Get configuration
    const config = getConfiguration();
    const PORT = config.port || parseInt(process.env.PORT || '3000', 10);

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Start scheduled tasks
    await startScheduledTasks();
    
    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      
      // Stop scheduled tasks
      stopScheduledTasks();
      
      // Close server
      server.close(() => {
        logger.info('Server shut down successfully');
        process.exit(0);
      });
      
      // Force exit after timeout
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
