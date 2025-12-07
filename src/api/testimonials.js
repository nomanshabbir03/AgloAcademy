import apiClient from './client';

export const fetchTestimonials = async (filters = {}) => {
  const params = { ...filters };
  const response = await apiClient.get('/testimonials', { params });
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchTestimonialById = async (id) => {
  const response = await apiClient.get(`/testimonials/${id}`);
  return response.data;
};

export const createTestimonial = async (payload) => {
  const response = await apiClient.post('/testimonials', payload);
  return response.data;
};

export const updateTestimonial = async (testimonialId, payload) => {
  const response = await apiClient.patch(`/testimonials/${testimonialId}`, payload);
  return response.data;
};

export const deleteTestimonial = async (testimonialId) => {
  const response = await apiClient.delete(`/testimonials/${testimonialId}`);
  return response.data;
};