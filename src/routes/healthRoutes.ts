import { Router, Request, Response } from 'express';
import { getFirestore } from '../config/firebase';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Health check endpoint
 * Checks the application's health by:
 * 1. Verifying the server is running
 * 2. Testing the Firestore connection
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Check Firestore connection
    const db = getFirestore();
    const testQuery = await db.collection('status_logs').limit(1).get();
    
    // Return health status
    res.json({
      success: true,
      status: 'healthy',
      checks: {
        server: true,
        firestore: true
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Health check failed:', error);
    
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      checks: {
        server: true,
        firestore: false
      },
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
