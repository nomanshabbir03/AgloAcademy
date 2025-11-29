import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

const toastStyles = {
  success: {
    iconColor: '#4ade80',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#4ade80' }}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  error: {
    iconColor: '#f87171',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#f87171' }}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  },
  warning: {
    iconColor: '#fbbf24',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#fbbf24' }}>
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  },
  info: {
    iconColor: '#60a5fa',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#60a5fa' }}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);

    // Auto-hide after duration
    setTimeout(() => {
      setToasts(currentToasts => 
        currentToasts.filter(toast => toast.id !== id)
      );
    }, duration);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(currentToasts => 
      currentToasts.filter(toast => toast.id !== id)
    );
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-80 max-w-full">
        <AnimatePresence>
          {toasts.map(toast => {
            const style = toastStyles[toast.type] || toastStyles.info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95, x: 20, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="p-5 rounded-[20px]"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 30px 60px rgba(15, 23, 42, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {style.icon}
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#1f2937' }}>
                      {toast.message}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => hideToast(toast.id)}
                      className="inline-flex focus:outline-none transition-colors duration-200"
                      style={{ color: '#6b7280' }}
                      onMouseEnter={(e) => e.target.style.color = '#1f2937'}
                      onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
