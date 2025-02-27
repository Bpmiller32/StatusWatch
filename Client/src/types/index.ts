// TypeScript type definitions for the application

// Example status type that will be used in Phase 2
export interface StatusData {
  status: 'up' | 'down' | 'degraded';
  lastUpdated: string;
  message?: string;
}

// Example list entry types that will be used in Phase 2
export interface BaseEntry {
  id: string;
  timestamp: string;
  message: string;
}

export interface SteadyEntry extends BaseEntry {
  type: 'steady';
  duration: number;
}

export interface PingEntry extends BaseEntry {
  type: 'ping';
  responseTime: number;
}

export type StatusEntry = SteadyEntry | PingEntry;

// Pagination parameters for API requests
export interface PaginationParams {
  limit?: number;
  startAfter?: string;
}
