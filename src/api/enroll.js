import apiClient from './client';

export const enrollInCourseRequest = async (courseId, payload = {}) => {
  const response = await apiClient.post(`/enroll/${courseId}`, payload);
  return response.data;
};

export const getEnrollmentStatusRequest = async (courseId) => {
  const response = await apiClient.get(`/enroll/status/${courseId}`);
  return response.data;
};

export const fetchMyEnrollments = async () => {
  const response = await apiClient.get('/enroll/my');
  return response.data;
};
