import apiClient from '../utils/apiClient';

/**
 * Enroll in a course
 * @param {string} courseId - The ID of the course to enroll in
 * @param {Object} [payload={}] - Additional enrollment data
 * @returns {Promise<Object>} The enrollment response
 */
export const enrollInCourseRequest = async (courseId, payload = {}) => {
  try {
    const response = await apiClient.post(`/enroll/${courseId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Enrollment failed:', error);
    throw error;
  }
};

/**
 * Get enrollment status for a course
 * @param {string} courseId - The ID of the course to check
 * @returns {Promise<Object>} The enrollment status
 */
export const getEnrollmentStatusRequest = async (courseId) => {
  try {
    const response = await apiClient.get(`/enroll/status/${courseId}`);
    return response.data;
  } catch (error) {
    // If 404, return null instead of throwing
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Failed to fetch enrollment status:', error);
    throw error;
  }
};

/**
 * Get current user's enrollments
 * @returns {Promise<Array>} Array of user's enrollments
 */
export const fetchMyEnrollments = async () => {
  try {
    const response = await apiClient.get('/enroll/my');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch enrollments:', error);
    return [];
  }
};
