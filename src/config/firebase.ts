import * as admin from 'firebase-admin';
import { logger } from '../utils/logger';

// Initialize Firebase Admin SDK
export const initializeFirebase = (): void => {
  try {
    // Check if app is already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        // No databaseURL needed for Firestore-only applications
        projectId: process.env.FIREBASE_PROJECT_ID
      });
      
      logger.info('Firebase initialized successfully');
    }
  } catch (error) {
    logger.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Get Firestore database instance
export const getFirestore = (): FirebaseFirestore.Firestore => {
  if (admin.apps.length === 0) {
    initializeFirebase();
  }
  return admin.firestore();
};
