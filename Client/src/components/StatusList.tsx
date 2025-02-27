import { useCombinedEntries } from '../hooks';
import { LoadingSkeleton } from './';
import { motion } from 'framer-motion';

const StatusList = () => {
  const { entries, loading, error, hasMore, loadMore } = useCombinedEntries(10, 3);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getEntryTypeLabel = (type: string) => {
    switch (type) {
      case 'steady':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Steady
          </span>
        );
      case 'ping':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
            Ping
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Unknown
          </span>
        );
    }
  };

  // Filter entries from the last 3 hours
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const filteredEntries = entries.filter(entry => entry.timestamp >= threeHoursAgo);

  if (loading && entries.length === 0) {
    return <LoadingSkeleton type="list" count={5} />;
  }

  if (error && entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Status Entries</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6"
      role="region"
      aria-labelledby="status-list-title"
    >
      <h2 id="status-list-title" className="text-xl font-semibold mb-4">Recent Status Entries</h2>
      
      {filteredEntries.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No status entries in the last 3 hours</p>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <motion.div 
              key={entry.id} 
              className="flex items-start p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              tabIndex={0}
              role="article"
              aria-label={`${entry.type} entry: ${entry.message}`}
            >
              <div className="mr-3">
                {getEntryTypeLabel(entry.type)}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{entry.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <time dateTime={entry.timestamp}>{formatTimestamp(entry.timestamp)}</time>
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {entry.type === 'steady' && `${entry.duration}ms`}
                {entry.type === 'ping' && `${entry.responseTime}ms`}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={loading ? 'Loading more entries' : 'Load more entries'}
            aria-busy={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusList;
