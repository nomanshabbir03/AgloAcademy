import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

// Larger, smooth shooting stars for auth backgrounds, inspired by reference image
const ShootingStars = () => {
  // Precompute a few meteor paths in viewport units so they scale with screen size
  const meteors = useMemo(
    () => [
      {
        id: 'meteor-1',
        from: { x: '-25vw', y: '-5vh' },
        to: { x: '110vw', y: '35vh' },
        delay: 0,
        duration: 3.0,
      },
      {
        id: 'meteor-2',
        from: { x: '-20vw', y: '5vh' },
        to: { x: '105vw', y: '45vh' },
        delay: 0.8,
        duration: 3.2,
      },
      {
        id: 'meteor-3',
        from: { x: '-30vw', y: '20vh' },
        to: { x: '115vw', y: '60vh' },
        delay: 1.6,
        duration: 3.4,
      },
      {
        id: 'meteor-4',
        from: { x: '-10vw', y: '35vh' },
        to: { x: '120vw', y: '80vh' },
        delay: 2.2,
        duration: 3.6,
      },
      {
        id: 'meteor-5',
        from: { x: '-35vw', y: '-10vh' },
        to: { x: '95vw', y: '25vh' },
        delay: 2.8,
        duration: 3.3,
      },
    ],
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-[1]"
      style={{ mixBlendMode: 'screen' }}
    >
      {meteors.map((m) => (
        <motion.div
          key={m.id}
          className="absolute"
          initial={{
            x: m.from.x,
            y: m.from.y,
            opacity: 0,
          }}
          animate={{
            x: m.to.x,
            y: m.to.y,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            // Shorter gaps so there is almost always a meteor visible
            repeatDelay: 0.8,
            ease: 'easeOut',
          }}
        >
          <div
            className="relative"
            style={{
              width: '3px',
              height: '3px',
              borderRadius: '999px',
              background: 'rgba(248,250,252,0.98)',
              boxShadow: '0 0 24px rgba(248,250,252,0.95)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-520px',
                top: '-1px',
                width: '520px',
                height: '3px',
                borderRadius: '999px',
                background:
                  'linear-gradient(90deg, rgba(15,23,42,0), rgba(191,219,254,0.95), rgba(248,250,252,0))',
                filter: 'blur(0.6px)',
                transform: 'rotate(3deg)',
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default memo(ShootingStars);
