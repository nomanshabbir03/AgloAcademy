import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourses, getCourse, getFeaturedCourses } from '../api/courses';

export const useCourses = (filters = {}) => {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getCourses(filters),
    keepPreviousData: true,
  });
};

export const useCourse = (id) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id),
    enabled: !!id,
  });
};

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: ['featured-courses'],
    queryFn: getFeaturedCourses,
  });
};

// Optimistic updates for courses
export const useCourseMutations = () => {
  const queryClient = useQueryClient();

  const updateCourseCache = (updatedCourse) => {
    queryClient.setQueryData(['course', updatedCourse.id], updatedCourse);
    
    // Update the course in the courses list if it exists
    queryClient.setQueryData(['courses'], (old) => {
      if (!old) return { data: { courses: [updatedCourse] } };
      return {
        ...old,
        data: {
          ...old.data,
          courses: old.data.courses.map(course => 
            course.id === updatedCourse.id ? updatedCourse : course
          ),
        },
      };
    });
  };

  return {
    updateCourseCache,
  };
};
