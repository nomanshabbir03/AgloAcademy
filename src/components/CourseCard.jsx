import { motion } from 'framer-motion';
import { Star, Clock, Users, ArrowRight, User, StarHalf } from 'lucide-react';
import LazyImage from './LazyImage';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CourseCard = ({ course, isEnrolled = false, isPending = false }) => {
  const [randomStudents, setRandomStudents] = useState(0);
  const [randomRating, setRandomRating] = useState(0);

  useEffect(() => {
    // Generate random number of students between 50 and 500
    setRandomStudents(Math.floor(Math.random() * 451) + 50);
    // Generate random rating between 3.5 and 5 with 0.5 increments
    setRandomRating((Math.floor(Math.random() * 4) + 7) / 2);
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} className="text-yellow-400 fill-current" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={16} className="text-yellow-400 fill-current" />);
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }

    return stars;
  };
  return (
    <motion.div
      className="card overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Course Image with Lazy Loading */}
      <div className="relative h-48 overflow-hidden">
        <LazyImage
          src={course.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop'}
          alt={course.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          width="100%"
          height="100%"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            width: '100%',
            height: '100%'
          }}
        />
        {course.price && (
          <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow-sm">
            <span className="text-sm font-semibold text-primary-600">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
          </div>
        )}
        {(isEnrolled || isPending) && (
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${{
                enrolled: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
              }[isEnrolled ? 'enrolled' : 'pending']}`}
            >
              {isEnrolled ? 'Enrolled' : 'Pending approval'}
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Rating and Students */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex items-center">
              {renderStars(course.averageRating || randomRating)}
              <span className="ml-1 text-sm font-medium text-gray-600">
                {course.averageRating?.toFixed(1) || randomRating.toFixed(1)}
                <span className="text-gray-400 text-xs ml-1">({Math.floor(randomRating * 20) + 10})</span>
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Users size={16} className="mr-1" />
            <span>{course.students?.length > 0 ? course.students.length : randomStudents} students</span>
          </div>
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
          <Link to={`/courses/${course._id || course.id}`}>
            {course.title}
          </Link>
        </h3>

        {/* Course Description - reserved space for ~2 lines */}
        <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3.25rem]">
          {course.description || 'No description available'}
        </p>

        {/* Course Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-2 flex-shrink-0" />
            <span>{course.duration || 'Self-paced'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="capitalize">{course.level?.toLowerCase() || 'All levels'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <User size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">
              {course.instructor?.name || 'Professional Instructor'}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1 font-medium">{Array.isArray(course.modules) ? course.modules.length : 0}</span>
            <span>modules</span>
          </div>
        </div>

        {/* View Details Button */}
        <Link 
          to={`/courses/${course._id || course.id}`}
          className="block w-full mt-auto"
        >
          <motion.div
            className="w-full btn-primary flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}

export default CourseCard 