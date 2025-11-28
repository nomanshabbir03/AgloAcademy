import apiClient from './client';

export const fetchBlogs = async (params = {}) => {
  const response = await apiClient.get('/blog', { params });
  return response.data;
};

export const fetchBlogById = async (id) => {
  const response = await apiClient.get(`/blog/${id}`);
  return response.data;
};

export const createBlog = async (payload) => {
  const response = await apiClient.post('/blog', payload);
  return response.data;
};

export const updateBlog = async (id, payload) => {
  const response = await apiClient.patch(`/blog/${id}`, payload);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await apiClient.delete(`/blog/${id}`);
  return response.data;
};
