import apiClient from './client';
import { enrollInCourseRequest as enrollRequest } from './enroll';

const mapCourse = (course) => {
  if (!course) return course;
  return {
    ...course,
    image: course.thumbnail || course.image,
    averageRating: typeof course.rating === 'number' ? course.rating : course.averageRating,
    students: course.students || [],
    level: course.level || 'All Levels',
    instructor: typeof course.instructor === 'string'
      ? { name: course.instructor }
      : course.instructor,
  };
};

export const getCourses = async (filters = {}) => {
  const params = { ...filters };
  const response = await apiClient.get('/courses', { params });
  return Array.isArray(response.data) ? response.data.map(mapCourse) : [];
};

export const getCourse = async (id) => {
  const response = await apiClient.get(`/courses/${id}`);
  return mapCourse(response.data);
};

export const getFeaturedCourses = async () => {
  const response = await apiClient.get('/courses', { params: { featured: true } });
  return Array.isArray(response.data) ? response.data.map(mapCourse) : [];
};

export const enrollInCourseRequest = async (courseId, payload) => {
  return enrollRequest(courseId, payload);
};
