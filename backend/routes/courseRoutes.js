import express from 'express';
import { protect, authorizeRoles, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);

router.post('/', protect, roleMiddleware('admin'), createCourse);
router.patch('/:id', protect, roleMiddleware('admin'), updateCourse);
router.delete('/:id', protect, roleMiddleware('admin'), deleteCourse);

export default router;
