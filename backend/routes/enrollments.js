import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { enrollInCourse } from '../controllers/enrollmentController.js';

const router = express.Router();

// @route   POST /api/enroll/:courseId
// @desc    Enroll current student into a course
// @access  Private/Student
router.post('/:courseId', protect, authorizeRoles('student'), enrollInCourse);

export default router;
