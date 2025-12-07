import apiClient from './client';

const mapService = (service) => {
  if (!service) return service;
  return {
    ...service,
    image: service.image,
    isActive: service.isActive !== false,
  };
};

export const fetchServices = async (filters = {}) => {
  const params = { ...filters };
  const response = await apiClient.get('/services', { params });
  return Array.isArray(response.data) ? response.data.map(mapService) : [];
};

export const fetchServiceById = async (id) => {
  const response = await apiClient.get(`/services/${id}`);
  return mapService(response.data);
};
