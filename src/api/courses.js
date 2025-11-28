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

export const fetchCourses = async () => {
  const response = await apiClient.get('/courses');
  return response.data.map(mapCourse);
};

export const fetchCourseById = async (id) => {
  const response = await apiClient.get(`/courses/${id}`);
  return mapCourse(response.data);
};

export const enrollInCourseRequest = async (courseId, payload) => {
  return enrollRequest(courseId, payload);
};
