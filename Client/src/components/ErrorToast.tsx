import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  const handleClose = useCallback(() => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 max-w-md"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg flex items-start">
            <div className="flex-shrink-0" aria-hidden="true">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-700">{message}</p>
            </div>
            <button 
              onClick={handleClose}
              className="ml-4 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              aria-label="Close error message"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorToast;
