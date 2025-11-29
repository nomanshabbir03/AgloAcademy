import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, AlertCircle, ArrowRight, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchMyEnrollments } from '../api/enroll';
import { useToast } from '../context/ToastContext.jsx';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyLearning = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchMyEnrollments();
        const enrollmentsList = Array.isArray(data) ? data : [];
        setEnrollments(enrollmentsList);
      } catch (err) {
        console.error('Failed to load enrollments:', err);
        setError('Failed to load your enrolled courses. Please try again.');
        showToast('Failed to load your courses', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadEnrollments();
  }, [user, showToast]);

  // Separate approved and pending enrollments
  const approvedEnrollments = enrollments.filter(e => e.status === 'approved' && e.course);
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending' && e.course);

  // Filter courses based on search and status
  const getFilteredCourses = (enrollmentList) => {
    let filtered = [...enrollmentList];

    // Filter by status
    if (filterStatus === 'approved') {
      filtered = filtered.filter(e => e.status === 'approved');
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(e => e.status === 'pending');
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => {
        const course = e.course;
        if (!course) return false;
        return (
          course.title?.toLowerCase().includes(term) ||
          course.description?.toLowerCase().includes(term) ||
          course.instructor?.name?.toLowerCase().includes(term) ||
          course.category?.toLowerCase().includes(term)
        );
      });
    }

    return filtered;
  };

  const filteredApproved = getFilteredCourses(approvedEnrollments);
  const filteredPending = getFilteredCourses(pendingEnrollments);

  // Get all courses for display (from approved enrollments)
  const approvedCourses = filteredApproved.map(e => e.course);
  const pendingCourses = filteredPending.map(e => e.course);

  if (!user) {
    return null;
  }

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
              My Learning
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Continue your learning journey and track your progress
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search your courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Courses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <motion.div
              className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Courses</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <div className="space-y-12">
              {/* Approved Courses Section */}
              {filterStatus === 'all' || filterStatus === 'approved' ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <h2 className="text-2xl font-bold text-gray-800">
                        Approved Courses
                        {filterStatus === 'all' && (
                          <span className="ml-2 text-lg font-normal text-gray-500">
                            ({approvedCourses.length})
                          </span>
                        )}
                      </h2>
                    </div>
                  </div>

                  {approvedCourses.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {approvedCourses.map((course) => (
                        <CourseCard
                          key={course._id || course.id}
                          course={course}
                          isEnrolled={true}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      className="bg-white rounded-xl shadow-sm p-12 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm || filterStatus === 'approved'
                          ? 'No approved courses found'
                          : 'No approved courses yet'}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {searchTerm
                          ? 'Try adjusting your search terms'
                          : 'Start learning by enrolling in courses from our course catalog'}
                      </p>
                      {!searchTerm && (
                        <Link to="/courses" className="btn-primary inline-flex items-center space-x-2">
                          <span>Browse Courses</span>
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </motion.div>
                  )}
                </div>
              ) : null}

              {/* Pending Courses Section */}
              {filterStatus === 'all' || filterStatus === 'pending' ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-yellow-600" />
                      <h2 className="text-2xl font-bold text-gray-800">
                        Pending Approval
                        {filterStatus === 'all' && (
                          <span className="ml-2 text-lg font-normal text-gray-500">
                            ({pendingCourses.length})
                          </span>
                        )}
                      </h2>
                    </div>
                  </div>

                  {pendingCourses.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {pendingCourses.map((course) => (
                        <CourseCard
                          key={course._id || course.id}
                          course={course}
                          isPending={true}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      className="bg-white rounded-xl shadow-sm p-12 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm || filterStatus === 'pending'
                          ? 'No pending courses found'
                          : 'No pending enrollments'}
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm
                          ? 'Try adjusting your search terms'
                          : 'All your enrollments have been approved!'}
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : null}

              {/* Empty State - No enrollments at all */}
              {enrollments.length === 0 && !isLoading && (
                <motion.div
                  className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Start Your Learning Journey
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    You haven't enrolled in any courses yet. Explore our course catalog and start learning today!
                  </p>
                  <Link to="/courses" className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4">
                    <span>Browse All Courses</span>
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {approvedCourses.length > 0 && (
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
                Want to Learn More?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Explore our full course catalog and discover new skills
              </p>
              <Link to="/courses" className="btn-primary">
                Browse All Courses
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MyLearning;

