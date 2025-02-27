import { useState, useEffect, useCallback } from 'react';
import { StatusEntry, PaginationParams } from '../types';
// Will be used when connecting to real API
// import apiClient from '../services/api';

interface UseCombinedEntriesReturn {
  entries: StatusEntry[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useCombinedEntries = (
  initialLimit = 10,
  timeFilterHours = 3
): UseCombinedEntriesReturn => {
  const [entries, setEntries] = useState<StatusEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: initialLimit,
    startAfter: ''
  });

  const fetchEntries = useCallback(async (isRefresh = false) => {
    try {
      setLoading(true);
      
      // In a real implementation, we would use the API client
      // For now, we'll simulate the API response with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate random entries for demonstration
      const currentTimestamp = new Date();
      
      // Mock steady entries
      const mockSteadyEntries = Array.from({ length: 5 }, (_, i) => {
        const timestamp = new Date(currentTimestamp);
        timestamp.setMinutes(timestamp.getMinutes() - (i * 15));
        
        return {
          id: `steady-${Date.now()}-${i}`,
          type: 'steady' as const,
          timestamp: timestamp.toISOString(),
          message: `Steady monitoring check ${i + 1}`,
          duration: Math.floor(Math.random() * 500) + 100
        };
      });
      
      // Mock ping entries
      const mockPingEntries = Array.from({ length: 5 }, (_, i) => {
        const timestamp = new Date(currentTimestamp);
        timestamp.setMinutes(timestamp.getMinutes() - (i * 10));
        
        return {
          id: `ping-${Date.now()}-${i}`,
          type: 'ping' as const,
          timestamp: timestamp.toISOString(),
          message: `Ping check ${i + 1}`,
          responseTime: Math.floor(Math.random() * 200) + 50
        };
      });
      
      // Combine and sort by timestamp (newest first)
      const combinedEntries = [...mockSteadyEntries, ...mockPingEntries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Update entries state
      setEntries(prevEntries => {
        if (isRefresh) {
          return combinedEntries;
        }
        return [...prevEntries, ...combinedEntries];
      });
      
      // Update pagination for next page
      if (combinedEntries.length < (pagination.limit || initialLimit)) {
        setHasMore(false);
      } else {
        setPagination(prev => ({
          ...prev,
          startAfter: combinedEntries[combinedEntries.length - 1]?.timestamp || ''
        }));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Failed to load status entries');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, initialLimit]);

  // Initial fetch
  useEffect(() => {
    fetchEntries(true);
  }, [fetchEntries]);

  // Function to load more entries
  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchEntries();
    }
  }, [fetchEntries, loading, hasMore]);

  // Function to refresh entries
  const refresh = useCallback(async () => {
    setPagination({ limit: initialLimit, startAfter: '' });
    setHasMore(true);
    await fetchEntries(true);
  }, [fetchEntries, initialLimit]);

  // Filter entries by time
  const filteredEntries = entries.filter(entry => {
    if (timeFilterHours <= 0) return true;
    
    const entryTime = new Date(entry.timestamp).getTime();
    const cutoffTime = new Date().getTime() - (timeFilterHours * 60 * 60 * 1000);
    return entryTime >= cutoffTime;
  });

  return {
    entries: filteredEntries,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};
