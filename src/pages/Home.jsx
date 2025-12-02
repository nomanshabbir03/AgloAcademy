import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award, TrendingUp, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Slider from '../components/Slider';
import CourseCard from '../components/CourseCard';
import { useFeaturedCourses } from '../hooks/useCourses';

// TikTok Icon Component
const TikTok = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const Home = () => {
  const stats = [
    { icon: Users, number: 2000, suffix: '+', label: 'Students' },
    { icon: BookOpen, number: 50, suffix: '+', label: 'Courses' },
    { icon: Award, number: 20, suffix: '+', label: 'Instructors' },
    { icon: TrendingUp, number: 95, suffix: '%', label: 'Success Rate' }
  ];

  const { data: featuredCourses = [], isLoading: featuredLoading, isError: featuredError } =
    useFeaturedCourses();

  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <div className="min-h-screen">
      <Slider />

      <section className="section-padding bg-white relative overflow-hidden">
        {/* Social Media Icons - Left Side */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center space-y-5 absolute left-0 lg:left-6 xl:left-8 top-0 bottom-0 z-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <a 
            href="https://www.facebook.com/share/1DbnEoGtjk/?mibextid=wwXIfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
            aria-label="Visit our Facebook page"
          >
            <Facebook size={24} />
          </a>
          <a 
            href="https://www.instagram.com/myagloacademy?igsh=MWZvZ3I4c3poZXc2Yg==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
            aria-label="Visit our Instagram page"
          >
            <Instagram size={24} />
          </a>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
            aria-label="Visit our YouTube channel"
          >
            <Youtube size={24} />
          </a>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
            aria-label="Visit our LinkedIn page"
          >
            <Linkedin size={24} />
          </a>
          <a 
            href="https://www.tiktok.com/@myagloacademy?_r=1&_t=ZS-91mXOOhYRQz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
            aria-label="Visit our TikTok page"
          >
            <TikTok size={24} />
          </a>
        </motion.div>

        <div className="container-custom text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Welcome to Aglo Academy
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We provide world-class education and training prepared by industry experts.
            </p>
            <Link to="/courses" className="btn-primary">
              Join Now
            </Link>

            {/* Social Media Icons - Mobile (under Join button) */}
            <div className="mt-6 flex lg:hidden items-center justify-center space-x-5">
              <a
                href="https://www.facebook.com/share/1DbnEoGtjk/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/myagloacademy?igsh=MWZvZ3I4c3poZXc2Yg=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
                aria-label="Visit our Instagram page"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
                aria-label="Visit our YouTube channel"
              >
                <Youtube size={24} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
                aria-label="Visit our LinkedIn page"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.tiktok.com/@myagloacademy?_r=1&_t=ZS-91mXOOhYRQz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
                aria-label="Visit our TikTok page"
              >
                <TikTok size={24} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={statsRef} className="section-padding bg-primary-50">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600">Numbers that speak for our commitment</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <stat.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {statsInView && (
                      <CountUp
                        start={0}
                        end={stat.number}
                        duration={1.8}
                        delay={index * 0.2}
                        suffix={stat.suffix}
                        separator=","
                      />
                    )}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600">Discover our most popular courses</p>
          </motion.div>

          {featuredError ? (
            <p className="text-center text-red-500 text-sm">
              Failed to load featured courses. Please try again later.
            </p>
          ) : featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-64 bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : featuredCourses.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No featured courses yet. Mark a course as featured from the admin dashboard.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/courses" className="btn-secondary">
              View All Courses
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-primary-600">
        <div className="container-custom">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who have transformed their careers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses" className="btn-primary">
                Browse Courses
              </Link>
              <Link to="/contact" className="btn-primary">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
