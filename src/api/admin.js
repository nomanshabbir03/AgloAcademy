// ============================================
// FILE 5: frontend/src/api/admin.js (ADD THESE LINES)
// ============================================
import apiClient from './client';

export const fetchEnrollments = async () => {
  const response = await apiClient.get('/enroll/');
  return response.data;
};

export const approveEnrollmentRequest = async (enrollmentId) => {
  const response = await apiClient.patch(`/enroll/${enrollmentId}/approve`);
  return response.data;
};

export const rejectEnrollmentRequest = async (enrollmentId) => {
  const response = await apiClient.patch(`/enroll/${enrollmentId}/reject`);
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

// ✨ NEW: Admin testimonial management helpers
export const fetchAdminTestimonials = async () => {
  const response = await apiClient.get('/testimonials');
  return response.data;
};

export const createTestimonialAdmin = async (payload) => {
  const response = await apiClient.post('/testimonials', payload);
  return response.data;
};

export const updateTestimonialAdmin = async (testimonialId, payload) => {
  const response = await apiClient.patch(`/testimonials/${testimonialId}`, payload);
  return response.data;
};

export const deleteTestimonialAdmin = async (testimonialId) => {
  const response = await apiClient.delete(`/testimonials/${testimonialId}`);
  return response.data;
};

// Admin service management helpers
export const fetchAdminServices = async () => {
  const response = await apiClient.get('/services');
  return response.data;
};

export const createServiceAdmin = async (payload) => {
  const response = await apiClient.post('/services', payload);
  return response.data;
};

export const updateServiceAdmin = async (serviceId, payload) => {
  const response = await apiClient.patch(`/services/${serviceId}`, payload);
  return response.data;
};

export const deleteServiceAdmin = async (serviceId) => {
  const response = await apiClient.delete(`/services/${serviceId}`);
  return response.data;
};