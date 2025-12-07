import express from 'express';
import { protect, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);

// Admin only routes
router.post('/', protect, roleMiddleware('admin'), createTestimonial);
router.patch('/:id', protect, roleMiddleware('admin'), updateTestimonial);
router.delete('/:id', protect, roleMiddleware('admin'), deleteTestimonial);

export default router;