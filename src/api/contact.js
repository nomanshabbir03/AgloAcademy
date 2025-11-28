import apiClient from './client';

/**
 * Send inquiry/contact form
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - User's name
 * @param {string} formData.email - User's email
 * @param {string} formData.subject - Inquiry subject
 * @param {string} formData.message - Inquiry message
 * @returns {Promise<Object>} Response data
 */
export const sendInquiry = async (formData) => {
  const response = await apiClient.post('/contact', formData);
  return response.data;
};

