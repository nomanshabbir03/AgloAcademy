import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState([])
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Update mouse position with requestAnimationFrame for better performance
  const updateMousePosition = useCallback((e) => {
    const { clientX, clientY } = e
    requestAnimationFrame(() => {
      const newPosition = { x: clientX, y: clientY }
      setMousePosition(newPosition)
      // Slightly longer trail for a smoother tail effect
      setTrail((prev) => [newPosition, ...prev].slice(0, 16))
      setIsVisible(true)
    })
  }, [])

  // Memoize the interactive elements selector
  const interactiveElements = useMemo(() => [
    'button',
    'a',
    'input',
    'textarea',
    'select',
    '[role="button"]',
    '[onclick]',
    '.cursor-pointer',
    '.btn-primary',
    '.btn-secondary'
  ].join(','), [])

  // Handle mouse enter/leave for hover effects
  const handleMouseEnter = useCallback((e) => {
    const target = e.target
    if (!target || typeof target.matches !== 'function') {
      setIsHovering(false)
      return
    }

    const isInteractive =
      target.matches(interactiveElements) ||
      (typeof target.closest === 'function' && target.closest(interactiveElements))

    setIsHovering(!!isInteractive)
  }, [interactiveElements])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  // Hide cursor when leaving window
  const handleMouseLeaveWindow = useCallback(() => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Throttle mousemove events for better performance
    let animationFrameId = null
    const throttledMouseMove = (e) => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          updateMousePosition(e)
          animationFrameId = null
        })
      }
    }

    // Add event listeners with passive where possible
    const options = { passive: true }
    document.addEventListener('mousemove', throttledMouseMove, options)
    document.addEventListener('mouseenter', handleMouseEnter, options)
    document.addEventListener('mouseleave', handleMouseLeave, options)
    document.addEventListener('mouseleave', handleMouseLeaveWindow, options)

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      document.removeEventListener('mousemove', throttledMouseMove, options)
      document.removeEventListener('mouseenter', handleMouseEnter, options)
      document.removeEventListener('mouseleave', handleMouseLeave, options)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow, options)
    }
  }, [updateMousePosition, handleMouseEnter, handleMouseLeave, handleMouseLeaveWindow])

  return (
    <>
      {trail.map((position, index) => (
        <motion.div
          key={index}
          ref={index === 0 ? cursorRef : null}
          className="fixed z-[9999] pointer-events-none will-change-transform"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            // Slightly larger base size with gentler falloff
            width: `${20 - index * 1}px`,
            height: `${20 - index * 1}px`,
            borderRadius: '9999px',
            transform: 'translate(-50%, -50%)',
            // Higher overall opacity with a softer falloff along the tail
            opacity: isVisible ? Math.max(0, 1 - index * 0.07) : 0,
            filter: 'blur(1.5px)',
            pointerEvents: 'none',
            // Disable hover effects on touch devices
            display: typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches ? 'block' : 'none',
          }}
          aria-hidden="true"
          animate={{
            scale: isHovering && index === 0 ? 1.3 : 1,
          }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              // Cyan accent glow to better match the site's primary accent palette
              background: 'radial-gradient(circle at center, rgba(84, 218, 255, 0.95), rgba(84, 218, 255, 0.15))',
            }}
          />
        </motion.div>
      ))}
    </>
  )
}

export default CustomCursor
