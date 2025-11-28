import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Function to remove the loading spinner
const removeLoadingSpinner = () => {
  const loadingElement = document.querySelector('.app-loading');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    setTimeout(() => {
      loadingElement.remove();
    }, 300);
  }
};

// Add error boundary for the entire app
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Root Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="mb-4">Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Function to initialize the app
const initApp = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Failed to find the root element');
    return;
  }

  // Disable browser's automatic scroll restoration
  // This prevents the browser from restoring scroll position on navigation
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  try {
    const root = createRoot(rootElement);
    
    // Render the app
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <App onAppReady={removeLoadingSpinner} />
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Set a timeout to ensure the loading spinner is removed even if the app takes too long
    setTimeout(removeLoadingSpinner, 5000);
    
  } catch (error) {
    console.error('Failed to render the app:', error);
    
    // Show error message
    const errorHtml = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #dc2626;">Application Error</h2>
        <p>Failed to initialize the application. Please try refreshing the page.</p>
        <p>${error.message}</p>
        <button 
          onclick="window.location.reload()" 
          style="margin-top: 10px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Refresh Page
        </button>
      </div>
    `;
    
    // If we have a root element, use it, otherwise set the whole body
    if (rootElement) {
      rootElement.innerHTML = errorHtml;
    } else {
      document.body.innerHTML = errorHtml;
    }
    
    // Make sure to remove the loading spinner
    removeLoadingSpinner();
  }
};

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Log environment info for debugging
console.log('Environment:', {
  nodeEnv: process.env.NODE_ENV,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  baseUrl: import.meta.env.BASE_URL
});
