import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import LazyImage from './LazyImage';

// Import local instructor images
import instructor1 from '../assets/images/instructor-hero-1.jpg';
import instructor2 from '../assets/images/instructor-hero-2.jpg';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const slides = [
    {
      id: 1,
      title: "Expert-Led Learning",
      subtitle: "Learn from experienced professionals",
      description: "Join our comprehensive courses designed to provide you with practical skills and real-world knowledge to excel in your career.",
      backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop",
      instructorImage: instructor1 || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      instructorName: "Sheikh Ishtiaq",
      instructorTitle: "Growth Strategist",
      buttonText: "View Courses",
      buttonLink: "/courses"
    },
    {
      id: 2,
      title: "Master Digital Skills",
      subtitle: "From industry experts",
      description: "Gain hands-on experience with the latest tools and technologies in digital design and technology.",
      backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop",
      instructorImage: instructor2 || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
      instructorName: "Hafiz Abdul Manan",
      instructorTitle: "Designer & Marketer",
      buttonText: "Explore Programs",
      buttonLink: "/courses"
    }
  ]

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const goToSlide = (index) => setCurrentSlide(index)

  return (
    <motion.section
      className="relative overflow-hidden min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] h-[80vh] lg:h-[85vh] max-h-[940px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="absolute inset-0 w-full h-full">
            <LazyImage
              src={slides[currentSlide].backgroundImage}
              alt={`Background for ${slides[currentSlide].title}`}
              className="w-full h-full"
              width={1920}
              height={1080}
              style={{
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-900/80"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 1
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 1
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">

            {/* Text - Left Side */}
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left space-y-6 px-2 sm:px-4 lg:px-8 xl:pl-16"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {slides[currentSlide].title}
              </h1>

              <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-200 font-semibold">
                {slides[currentSlide].subtitle}
              </h2>

              <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {slides[currentSlide].description}
              </p>

              <a
                href={slides[currentSlide].buttonLink}
                className="inline-flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl"
              >
                <span>{slides[currentSlide].buttonText}</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Instructor Image - Clean (No Frame) */}
            <motion.div
              key={`instructor-${currentSlide}`}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center lg:justify-end px-2 sm:px-4 lg:px-8 xl:pr-16"
            >
              <div className="relative text-center">
                <div className="relative w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-88 xl:h-88 mx-auto">
  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/30 shadow-2xl flex items-center justify-center bg-white/5">
    <LazyImage
      src={slides[currentSlide].instructorImage}
      alt={slides[currentSlide].instructorName}
      className="w-full h-full object-cover object-center"
      width={400}
      height={400}
      style={{
        objectFit: 'cover',
        objectPosition: 'center 18%'   // More headroom
      }}
    />
  </div>
</div>


                <div className="mt-6 space-y-1">
                  <h3 className="font-bold text-white text-xl md:text-2xl">
                    {slides[currentSlide].instructorName}
                  </h3>
                  <p className="text-blue-200 text-sm md:text-base">
                    {slides[currentSlide].instructorTitle}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125 shadow-lg" : "bg-white/50 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </motion.section>
  )
}

export default Slider
