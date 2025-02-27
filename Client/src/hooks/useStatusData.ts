import { useState, useEffect } from 'react';
import { StatusData } from '../types';
// Will be used when connecting to real API
// import apiClient from '../services/api';

interface UseStatusDataReturn {
  status: StatusData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStatusData = (autoRefreshInterval = 30000): UseStatusDataReturn => {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we would use the API client
      // For now, we'll simulate the API response with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for demonstration
      const mockStatus: StatusData = {
        status: Math.random() > 0.8 ? 'degraded' : (Math.random() > 0.9 ? 'down' : 'up'),
        lastUpdated: new Date().toISOString(),
        message: 'All systems operational'
      };
      
      // Uncomment this when the API is ready
      // const response = await apiClient.get('/fullstatus');
      // setStatus(response.data);
      
      setStatus(mockStatus);
      setError(null);
    } catch (err) {
      console.error('Error fetching status:', err);
      setError('Failed to load status information');
      
      // For demo purposes, set a fallback status when API fails
      setStatus({
        status: 'up',
        lastUpdated: new Date().toISOString(),
        message: 'Status information unavailable'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Set up auto-refresh if interval is provided
    if (autoRefreshInterval > 0) {
      const intervalId = setInterval(fetchStatus, autoRefreshInterval);
      return () => clearInterval(intervalId);
    }
    
    return undefined;
  }, [autoRefreshInterval]);

  return { status, loading, error, refetch: fetchStatus };
};
