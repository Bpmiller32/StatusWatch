import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text';
  count?: number;
  className?: string;
  ariaLabel?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1,
  className = '',
  ariaLabel = 'Loading content'
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div 
            className={`bg-white rounded-lg shadow-md p-6 animate-pulse ${className}`}
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label={ariaLabel}
          >
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <span className="sr-only">{ariaLabel}</span>
          </div>
        );
      
      case 'list':
        return (
          <div 
            className={`bg-white rounded-lg shadow-md p-6 ${className}`}
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label={ariaLabel}
          >
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-start p-3 border-b border-gray-100">
                  <div className="w-16 h-5 bg-gray-200 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <span className="sr-only">{ariaLabel}</span>
          </div>
        );
      
      case 'text':
        return (
          <div 
            className={`animate-pulse ${className}`}
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label={ariaLabel}
          >
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            ))}
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <span className="sr-only">{ariaLabel}</span>
          </div>
        );
      
      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
};

export default LoadingSkeleton;
