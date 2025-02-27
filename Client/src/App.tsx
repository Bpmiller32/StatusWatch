import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import { 
  StatusHeader, 
  StatusList, 
  ErrorToast,
  SingleColumnGrid
} from './components'

function App() {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const clearError = () => {
    setError(null);
  };

  // Set isLoaded to true after a short delay to trigger animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {error && <ErrorToast message={error} onClose={clearError} />}
      
      <AnimatePresence>
        <motion.div
          initial="initial"
          animate={isLoaded ? "animate" : "initial"}
          variants={pageVariants}
        >
          <motion.header 
            className="bg-white shadow-sm"
            variants={itemVariants}
          >
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-3xl font-bold text-center sm:text-left">StatusWatch</h1>
            </div>
          </motion.header>
          
          <motion.main 
            className="container mx-auto px-4 py-8"
            variants={itemVariants}
          >
            <SingleColumnGrid gap={6}>
              <StatusHeader />
              <StatusList />
            </SingleColumnGrid>
          </motion.main>
          
          <motion.footer 
            className="bg-white border-t border-gray-200 mt-12"
            variants={itemVariants}
          >
            <div className="container mx-auto px-4 py-6">
              <p className="text-center text-gray-500 text-sm">
                StatusWatch &copy; {new Date().getFullYear()} - Real-time system monitoring
              </p>
            </div>
          </motion.footer>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
