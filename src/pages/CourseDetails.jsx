import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ExternalLink, RotateCw } from 'lucide-react';
import { fetchCourseById, enrollInCourseRequest } from '../api/courses';
import { getEnrollmentStatusRequest } from '../api/enroll';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [hasPendingEnrollment, setHasPendingEnrollment] = useState(false);
  const [error, setError] = useState(null);

  const isPaid = useMemo(() => course && course.type === 'paid', [course]);

  const isEnrolled = useMemo(() => {
    if (!user || !course) return false;
    if (!Array.isArray(user.enrolledCourses)) return false;
    return user.enrolledCourses.some((c) => {
      const courseId = c._id || c.id;
      return courseId && courseId.toString() === (course._id || course.id)?.toString();
    });
  }, [user, course]);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCourseById(id);
        setCourse(data);

        // After loading the course, if user is logged in and this is a paid course,
        // check if there is a pending enrollment so we can show the correct state
        if (user && data?.type === 'paid') {
          try {
            const statusResponse = await getEnrollmentStatusRequest(data._id || data.id);
            if (statusResponse?.status === 'pending') {
              setHasPendingEnrollment(true);
            }
          } catch (statusErr) {
            console.error('Failed to load enrollment status:', statusErr);
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
        const status = err?.response?.status;
        if (status === 404) {
          setError('Course not found.');
        } else {
          setError('Failed to load course details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, navigate, user]);

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect to payment instructions page for this course
    navigate(`/courses/${id}/pay`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RotateCw className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Course Unavailable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const canAccessContent = !isPaid || isEnrolled;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-custom max-w-6xl mx-auto">
        {/* Top hero + summary */}
        <motion.div
          className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white rounded-2xl shadow-lg p-6 md:p-10 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="md:max-w-2xl">
              <p className="uppercase tracking-wide text-xs md:text-sm text-primary-100 mb-2">
                {course.type === 'paid' ? 'Paid Program' : 'Free Program'}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{course.title}</h1>
              <p className="text-sm md:text-base text-primary-100/90 mb-4 md:mb-6">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-3 text-xs md:text-sm text-primary-50/90">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20">
                  {course.duration || 'Self-paced'}
                </span>
                {course.level && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 capitalize">
                    {typeof course.level === 'object'
                      ? course.level.name || ''
                      : course.level}
                  </span>
                )}
                {course.instructor && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20">
                    Instructor:{' '}
                    {typeof course.instructor === 'object'
                      ? course.instructor.name || ''
                      : course.instructor}
                  </span>
                )}
              </div>
            </div>

            {/* Right side: enrollment card */}
            <div className="w-full md:w-80">
              <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-5 md:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Access</p>
                    <p className="text-sm font-semibold">
                      {isPaid ? 'Full course (paid)' : 'Full course (free)'}
                    </p>
                  </div>
                  {isPaid && (
                    <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      <Lock className="w-3 h-3 mr-1.5" />
                      Locked content
                    </div>
                  )}
                </div>

                {isPaid && (
                  <p className="text-xs text-slate-500">
                    Google Drive content is unlocked after your enrollment is approved by admin.
                  </p>
                )}

                {isPaid && !isEnrolled && (
                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={enrolling || hasPendingEnrollment}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {hasPendingEnrollment
                      ? 'Enrollment pending approval'
                      : enrolling
                      ? 'Redirecting...'
                      : 'Pay & Enroll'}
                  </button>
                )}

                {(!isPaid || isEnrolled) && (
                  <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                    You already have access to the full course content.
                  </div>
                )}

                {isPaid && hasPendingEnrollment && !isEnrolled && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    Your payment and enrollment request has been submitted. You will get access once
                    the admin approves it.
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content: modules + drive link */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {Array.isArray(course.modules) && course.modules.length > 0 && (
              <motion.div
                className="bg-white rounded-2xl shadow-md p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900">Course Modules</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Structured lessons to guide you from start to finish.
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-primary-50 text-primary-700 px-3 py-1 font-medium">
                    {course.modules.length} module{course.modules.length > 1 ? 's' : ''}
                  </span>
                </div>

                <ul className="space-y-3">
                  {course.modules.map((mod, index) => (
                    <li
                      key={index}
                      className="relative flex gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="mt-1">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-1">
                          {mod.title || `Module ${index + 1}`}
                        </p>
                        {mod.description && (
                          <p className="text-xs text-slate-600 whitespace-pre-wrap">
                            {mod.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {!Array.isArray(course.modules) || course.modules.length === 0 ? (
              <motion.div
                className="bg-white rounded-2xl shadow-md p-6 text-sm text-slate-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                The instructor has not added detailed modules yet. You will still get access to all
                available course materials.
              </motion.div>
            ) : null}
          </div>

          <div className="space-y-4">
            {canAccessContent ? (
              <motion.div
                className="bg-white rounded-2xl shadow-md p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-2">
                  Course Materials
                </h2>
                {course.googleDriveLink ? (
                  <a
                    href={course.googleDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open course materials on Google Drive
                  </a>
                ) : (
                  <p className="text-xs md:text-sm text-slate-600">
                    Course materials will be available soon. Please check back later.
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="bg-white rounded-2xl shadow-md p-6 text-center text-xs md:text-sm text-slate-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="mb-1 font-medium">Content locked</p>
                <p>
                  Enroll in this course to unlock the Google Drive materials and all protected
                  resources.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
