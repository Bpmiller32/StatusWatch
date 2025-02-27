import { getFirestore } from '../config/firebase';
import { logger } from './logger';
import { StatusLog, StatusLogWithId } from '../models/StatusLog';

// Collection names
const COLLECTIONS = {
  STATUS_LOGS: 'status_logs'
};

// Add status log to Firestore
export const addStatusLog = async (statusLog: Omit<StatusLog, 'timestamp'>): Promise<string> => {
  try {
    const db = getFirestore();
    const docRef = await db.collection(COLLECTIONS.STATUS_LOGS).add({
      ...statusLog,
      timestamp: new Date()
    });
    
    logger.info(`Status log added with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    logger.error('Error adding status log:', error);
    throw error;
  }
};

// Get latest status log from Firestore
export const getLatestStatusLog = async (): Promise<StatusLogWithId | null> => {
  try {
    const db = getFirestore();
    const snapshot = await db.collection(COLLECTIONS.STATUS_LOGS)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as StatusLogWithId;
  } catch (error) {
    logger.error('Error getting latest status log:', error);
    throw error;
  }
};

// Get status logs with pagination
export const getStatusLogs = async (
  limit: number = 10,
  startAfter?: Date
): Promise<StatusLogWithId[]> => {
  try {
    const db = getFirestore();
    let query = db.collection(COLLECTIONS.STATUS_LOGS)
      .orderBy('timestamp', 'desc')
      .limit(limit);
    
    if (startAfter) {
      query = query.startAfter(startAfter);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StatusLogWithId));
  } catch (error) {
    logger.error('Error getting status logs:', error);
    throw error;
  }
};

// Delete old status logs
export const deleteOldStatusLogs = async (days: number): Promise<number> => {
  try {
    const db = getFirestore();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const snapshot = await db.collection(COLLECTIONS.STATUS_LOGS)
      .where('timestamp', '<', cutoffDate)
      .get();
    
    if (snapshot.empty) {
      return 0;
    }
    
    // Delete documents in batches
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    logger.info(`Deleted ${snapshot.size} old status logs`);
    return snapshot.size;
  } catch (error) {
    logger.error('Error deleting old status logs:', error);
    throw error;
  }
};
