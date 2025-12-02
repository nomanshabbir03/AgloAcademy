import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import LazyImage from './LazyImage';

// Import local instructor images (same pattern as About page)
import InstructorHero1 from '../assets/images/instructor-hero-1.jpg';
import InstructorHero2 from '../assets/images/instructor-hero-2.jpg';

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
      instructorImage: InstructorHero1,
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
      instructorImage: InstructorHero2,
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
      className="relative overflow-hidden min-h-[520px] sm:min-h-[560px] lg:min-h-[640px] h-[80vh] lg:h-[85vh] max-h-[940px]"
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

      <div className="relative z-10 h-full flex items-center pt-20 pb-10 sm:pt-24 sm:pb-12">
        <div className="container-custom w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">

            {/* Text - Left Side */}
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left space-y-5 px-4 sm:px-6 lg:px-8 xl:pl-16"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {slides[currentSlide].title}
              </h1>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-200 font-semibold">
                {slides[currentSlide].subtitle}
              </h2>

              <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {slides[currentSlide].description}
              </p>

              <a
                href={slides[currentSlide].buttonLink}
                className="inline-flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-xl transition-all duration-300 shadow-xl text-sm sm:text-base"
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
              className="flex justify-center lg:justify-end px-4 sm:px-6 lg:px-8 xl:pr-16 mt-2 sm:mt-4 lg:mt-0"
            >
              <div className="relative text-center">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 mx-auto">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/30 shadow-2xl flex items-center justify-center bg-white/5">
                    <LazyImage
                      src={slides[currentSlide].instructorImage}
                      alt={slides[currentSlide].instructorName}
                      className="w-full h-full object-cover object-center"
                      width="100%"
                      height="100%"
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
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
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
