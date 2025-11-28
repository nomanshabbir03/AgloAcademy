import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * This component ensures that when navigating between routes,
 * the page scrolls to the top. This is necessary because React Router
 * doesn't automatically scroll to top on route changes in single-page applications.
 * 
 * The component uses the useLocation hook to detect route changes
 * and scrolls to the top whenever the location changes.
 * 
 * It handles lazy-loaded components by using requestAnimationFrame
 * to ensure scrolling happens after the DOM has updated.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM has updated
    // This is especially important for lazy-loaded components
    const scrollToTop = () => {
      // Scroll both window and document elements to ensure compatibility
      if (window.scrollTo) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }
      
      // Fallback for older browsers
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Immediate scroll
    scrollToTop();

    // Also scroll after a microtask to handle lazy-loaded components
    // This ensures the scroll happens even if components load asynchronously
    requestAnimationFrame(() => {
      scrollToTop();
      // Double-check after a short delay for very slow lazy loads
      setTimeout(scrollToTop, 100);
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;

