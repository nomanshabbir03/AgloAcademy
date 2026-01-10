// import express from 'express';
// import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
// import {
//   getCourses,
//   getCourseById,
//   createCourse,
//   updateCourse,
//   deleteCourse,
// } from '../controllers/courseController.js';

// const router = express.Router();

// // @route   GET /api/courses
// // @desc    Get list of all courses
// // @access  Public
// router.get('/', getCourses);

// // @route   GET /api/courses/:id
// // @desc    Get course details; restrict paid course content to enrolled students
// // @access  Public/Protected depending on course type
// router.get('/:id', getCourseById);

// // @route   POST /api/courses
// // @desc    Create a new course (admin only)
// // @access  Private/Admin
// router.post('/', protect, authorizeRoles('admin'), createCourse);

// // @route   PUT /api/courses/:id
// // @desc    Update a course (admin only)
// // @access  Private/Admin
// router.put('/:id', protect, authorizeRoles('admin'), updateCourse);

// // @route   DELETE /api/courses/:id
// // @desc    Delete a course (admin only)
// // @access  Private/Admin
// router.delete('/:id', protect, authorizeRoles('admin'), deleteCourse);

// export default router;
