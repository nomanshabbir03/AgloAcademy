import apiClient from './client';

export const loginRequest = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const registerRequest = async (data) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const meRequest = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const updateProfileRequest = async (profileData) => {
  const response = await apiClient.patch('/auth/profile', profileData);
  return response.data;
};

export const updatePasswordRequest = async ({ currentPassword, newPassword }) => {
  const response = await apiClient.patch('/auth/password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
