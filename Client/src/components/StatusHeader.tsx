import { motion } from 'framer-motion';
import { useStatusData } from '../hooks';
import { LoadingSkeleton } from './';

const StatusHeader = () => {
  const { status, loading, error, refetch } = useStatusData(30000);

  const getStatusColor = (statusType: string | undefined) => {
    switch (statusType) {
      case 'up':
        return 'bg-green-500';
      case 'down':
        return 'bg-red-500';
      case 'degraded':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (statusType: string | undefined) => {
    switch (statusType) {
      case 'up':
        return 'Operational';
      case 'down':
        return 'Outage';
      case 'degraded':
        return 'Degraded Performance';
      default:
        return 'Unknown';
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return <LoadingSkeleton type="card" className="mb-6" ariaLabel="Loading system status" />;
  }

  if (error && !status) {
    return (
      <div 
        className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const statusText = getStatusText(status?.status);

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 mb-6"
      role="region"
      aria-labelledby="status-header-title"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="status-header-title" className="text-2xl font-bold">System Status</h2>
        <div className="flex items-center">
          <motion.div
            className={`h-4 w-4 rounded-full mr-2 ${getStatusColor(status?.status)}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            aria-hidden="true"
          />
          <span 
            className="font-medium"
            aria-live="polite"
            aria-atomic="true"
          >
            {statusText}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600">{status?.message || 'No status message available'}</p>
      
      <div className="flex justify-between items-center mt-4">
        {status?.lastUpdated && (
          <p className="text-xs text-gray-500">
            Last updated: {new Date(status.lastUpdated).toLocaleString()}
          </p>
        )}
        
        <button
          onClick={handleRefresh}
          className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-label="Refresh status"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StatusHeader;
