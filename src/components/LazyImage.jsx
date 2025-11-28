import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width = '100%', 
  height = '100%',
  style = {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '50px', // Start loading when within 50px of viewport
        threshold: 0.01,
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src]);

  // Fallback image in case of error
  const fallbackImage = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop';
  const imageSrc = hasError ? fallbackImage : src;

  return (
    <div 
      ref={imgRef} 
      className={`relative ${className}`} 
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style 
      }}
    >
      {isInView && (
        <motion.img
          src={imageSrc}
          alt={alt || 'Course image'}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover ${className}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            ...style
          }}
          width={width}
          height={height}
          loading="lazy"
          {...props}
        />
      )}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
};

export default LazyImage;
