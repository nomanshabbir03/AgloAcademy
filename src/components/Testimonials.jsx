import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  // Sample testimonial data - Replace with your actual testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Ahmed",
      course: "Artificial Intelligence",
      year: "2024",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1",
      quote: "The AI course at TGD Planet completely transformed my understanding of machine learning. The instructors are incredibly knowledgeable and the hands-on projects prepared me for real-world applications."
    },
    {
      id: 2,
      name: "Muhammad Hassan",
      course: "Digital Marketing",
      year: "2024",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3",
      quote: "Best decision I ever made! The digital marketing program gave me practical skills that I immediately applied to my business. The ROI has been phenomenal."
    },
    {
      id: 3,
      name: "Ayesha Khan",
      course: "Graphic Designing",
      year: "2023",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5",
      quote: "As a complete beginner, I was nervous about learning design. The supportive environment and expert guidance helped me build a professional portfolio in just 3 months!"
    },
    {
      id: 4,
      name: "Ali Raza",
      course: "Video Editing",
      year: "2024",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=7",
      quote: "The video editing course exceeded all my expectations. From basics to advanced techniques, everything was covered with real industry projects. Now I'm freelancing successfully!"
    },
    {
      id: 5,
      name: "Fatima Malik",
      course: "Personal Grooming",
      year: "2023",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=9",
      quote: "This course boosted my confidence tremendously! The professional grooming techniques and personal branding strategies have opened so many doors for me."
    },
    {
      id: 6,
      name: "Usman Sheikh",
      course: "Neurosmetic",
      year: "2024",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=12",
      quote: "An eye-opening experience! The neurosmetic program provided unique insights that I haven't found anywhere else. Highly recommended for anyone in the beauty industry."
    }
  ]

  const renderStars = (rating) => {
    return (
      <div className="flex items-center justify-center space-x-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our successful graduates who transformed their careers with TGD Planet Academy
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-600"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                {/* Student Photo */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                      <Quote size={14} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                {renderStars(testimonial.rating)}

                {/* Testimonial Quote */}
                <p className="text-gray-700 text-center mb-6 leading-relaxed line-clamp-5">
                  "{testimonial.quote}"
                </p>

                {/* Student Info */}
                <div className="text-center border-t border-gray-100 pt-4">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.course}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Class of {testimonial.year}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4">
            Ready to start your own success story?
          </p>
          <motion.a
            href="/courses"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Our Courses
          </motion.a>
        </motion.div> */}
      </div>
    </section>
  )
}

export default Testimonials