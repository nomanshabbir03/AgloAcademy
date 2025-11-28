import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import your Molvi cap image (replace with your actual image path)
import molviCap from '../assets/images/molvi-cap.png';

const MolviCapCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if device is mobile/tablet
    const checkIfMobile = () => {
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(mobile);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    if (isMobile) return;

    // Add custom cursor styles to the document
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        cursor: none !important;
      }
      
      a, button, input, textarea, select, [role="button"], [tabindex] {
        cursor: none !important;
      }
      
      @media (hover: none) {
        * {
          cursor: auto !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Track mouse movement
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    // Handle hover states
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    
    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], [tabindex]'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.head.removeChild(style);
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [isMobile, isVisible]);

  if (isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '32px',
            height: '32px',
            transform: 'translate(-50%, -50%)',
            willChange: 'transform'
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            scale: isHovered ? 0.8 : 1,
            transition: { 
              type: 'spring',
              damping: 20,
              stiffness: 300
            }
          }}
          exit={{ opacity: 0 }}
        >
          <img
            src={molviCap}
            alt=""
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))',
              transform: isHovered ? 'rotate(15deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease-out'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MolviCapCursor;
