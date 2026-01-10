import apiClient from '../utils/apiClient';

/**
 * Map course data to a consistent format
 * @param {Object} course - The course data to map
 * @returns {Object} Mapped course data
 */
const mapCourse = (course) => {
  if (!course) return null;
  
  return {
    ...course,
    id: course._id || course.id, // Normalize ID field
    image: course.thumbnail || course.image,
    averageRating: typeof course.rating === 'number' ? course.rating : (course.averageRating || 0),
    students: Array.isArray(course.students) ? course.students : [],
    level: course.level || 'All Levels',
    instructor: typeof course.instructor === 'string' 
      ? { name: course.instructor } 
      : (course.instructor || { name: 'Unknown Instructor' }),
    modules: Array.isArray(course.modules) ? course.modules : [],
    createdAt: course.createdAt || new Date().toISOString(),
    updatedAt: course.updatedAt || new Date().toISOString()
  };
};

/**
 * Fetch all courses with optional filters
 * @param {Object} [filters={}] - Query parameters for filtering courses
 * @returns {Promise<Array>} Array of courses
 */
export const getCourses = async (filters = {}) => {
  try {
    const params = { ...filters };
    const response = await apiClient.get('/courses', { params });
    return Array.isArray(response.data) 
      ? response.data.map(mapCourse).filter(Boolean) 
      : [];
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
};

/**
 * Fetch a single course by ID
 * @param {string} id - Course ID
 * @returns {Promise<Object|null>} Course data or null if not found
 */
export const getCourse = async (id) => {
  if (!id) return null;
  
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return mapCourse(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Failed to fetch course ${id}:`, error);
    throw error;
  }
};

// Alias for getCourse for backward compatibility
export const fetchCourseById = getCourse;
export const getCourseById = getCourse;

/**
 * Fetch featured courses
 * @returns {Promise<Array>} Array of featured courses
 */
export const getFeaturedCourses = async () => {
  try {
    const response = await apiClient.get('/courses', { 
      params: { 
        featured: true,
        limit: 6 // Limit featured courses to 6 by default
      } 
    });
    return Array.isArray(response.data) 
      ? response.data.map(mapCourse).filter(Boolean)
      : [];
  } catch (error) {
    console.error('Failed to fetch featured courses:', error);
    return [];
  }
};

/**
 * Enroll in a course (re-exported from enroll.js)
 * @deprecated Use the function from './enroll' instead
 */
export { enrollInCourseRequest } from './enroll';
