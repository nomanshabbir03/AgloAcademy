import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Search, Filter, AlertCircle, RotateCw } from 'lucide-react'
import CourseCard from '../components/CourseCard'
import { getCourses as fetchCourses } from '../api/courses'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchMyEnrollments } from '../api/enroll'

const Courses = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [myEnrollments, setMyEnrollments] = useState([])
  const [enrollmentStatus, setEnrollmentStatus] = useState({ approved: new Set(), pending: new Set() })

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels']

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    filterCourses(term, selectedLevel)
  }

  const handleLevelFilter = (level) => {
    setSelectedLevel(level)
    filterCourses(searchTerm, level)
  }

  const filterCourses = (search, level, allCourses = courses) => {
    let filtered = [...allCourses]

      if (search) {
        const searchTerm = search.toLowerCase()
        filtered = filtered.filter(course =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          (typeof course.instructor === 'string'
            ? course.instructor.toLowerCase().includes(searchTerm)
            : course.instructor?.name?.toLowerCase().includes(searchTerm))
        )
      }

      if (level && level !== 'all') {
        filtered = filtered.filter(course => course.level === level)
      }

    setFilteredCourses(filtered)
  }

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchCourses()
        setCourses(data)
        setFilteredCourses(data)
      } catch (err) {
        console.error('Failed to load courses:', err)
        setError('Failed to load courses. Please try again later.')
        setCourses([])
        setFilteredCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!user) {
        setMyEnrollments([])
        setEnrollmentStatus({ approved: new Set(), pending: new Set() })
        return
      }
      try {
        const data = await fetchMyEnrollments()
        const list = Array.isArray(data) ? data : []
        setMyEnrollments(list)

        const pending = new Set(
          list
            .filter((e) => e.status === 'pending')
            .map((e) => (e.course?._id || e.course?.id || '').toString())
        )

        const approved = new Set(
          (user.enrolledCourses || []).map((c) => (c._id || c.id || '').toString())
        )

        setEnrollmentStatus({ approved, pending })
      } catch (err) {
        console.error('Failed to load enrollments for course status:', err)
      }
    }

    loadEnrollments()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Courses
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover a wide range of courses designed to help you master new skills 
              and advance your career in the digital age.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={handleSearch}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              {/* Level Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={selectedLevel}
                  onChange={(e) => handleLevelFilter(e.target.value)}
                  disabled={isLoading}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-gray-600">
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <RotateCw className="animate-spin mr-2 h-4 w-4" />
                    Finding courses...
                  </span>
                ) : (
                  `Showing ${filteredCourses.length} of ${courses.length} courses`
                )}
              </div>
              
              {(searchTerm || (selectedLevel && selectedLevel !== 'all')) && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedLevel('all')
                    setFilteredCourses(courses)
                  }}
                  disabled={isLoading}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error loading courses</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-6"></div>
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                key="courses-grid"
              >
                {filteredCourses.map((course) => {
                  const id = (course._id || course.id || '').toString()
                  const isEnrolled = enrollmentStatus.approved.has(id)
                  const isPending = enrollmentStatus.pending.has(id)
                  return (
                    <CourseCard
                      key={course.id || course._id}
                      course={course}
                      isEnrolled={isEnrolled}
                      isPending={isPending}
                    />
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-16 bg-white rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                key="no-results"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any courses matching your search. Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedLevel('all')
                      setFilteredCourses(courses)
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Contact us to discuss custom training solutions for your organization
            </p>
            <motion.a
              href="/contact"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Courses
