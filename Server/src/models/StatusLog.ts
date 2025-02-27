import * as admin from 'firebase-admin';

// Interface for ping result
export interface PingResult {
  endpoint: string;
  status: number;
  responseTime: number;
}

// Interface for log check result
export interface LogCheckResult {
  success: boolean;
  foundEntries: number;
  error: string | null;
}

// Interface for status log document
export interface StatusLog {
  timestamp: admin.firestore.Timestamp;
  pingResults: PingResult[];
  logCheck: LogCheckResult;
}

// Interface for status log document with ID
export interface StatusLogWithId extends StatusLog {
  id: string;
}
