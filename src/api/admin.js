import apiClient from './client';

export const fetchEnrollments = async () => {
  const response = await apiClient.get('/enroll/');
  return response.data;
};

export const approveEnrollmentRequest = async (enrollmentId) => {
  const response = await apiClient.patch(`/enroll/${enrollmentId}/approve`);
  return response.data;
};

// Admin course management helpers
export const fetchAdminCourses = async () => {
  const response = await apiClient.get('/courses');
  return response.data;
};

export const createCourseAdmin = async (payload) => {
  const response = await apiClient.post('/courses', payload);
  return response.data;
};

export const updateCourseAdmin = async (courseId, payload) => {
  const response = await apiClient.patch(`/courses/${courseId}`, payload);
  return response.data;
};

export const deleteCourseAdmin = async (courseId) => {
  const response = await apiClient.delete(`/courses/${courseId}`);
  return response.data;
};
