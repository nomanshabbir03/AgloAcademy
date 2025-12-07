import apiClient from './client';

export const fetchGalleryPosts = async () => {
  const response = await apiClient.get('/gallery');
  return response.data;
};

export const fetchGalleryPostById = async (id) => {
  const response = await apiClient.get(`/gallery/${id}`);
  return response.data;
};

export const createGalleryPost = async (formData) => {
  const response = await apiClient.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateGalleryPost = async (id, formData) => {
  const response = await apiClient.patch(`/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteGalleryPost = async (id) => {
  const response = await apiClient.delete(`/gallery/${id}`);
  return response.data;
};
