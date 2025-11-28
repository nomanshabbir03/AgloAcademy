import express from 'express';
import { protect, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';

const router = express.Router();

// Public
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin
router.post('/', protect, roleMiddleware('admin'), createBlog);
router.patch('/:id', protect, roleMiddleware('admin'), updateBlog);
router.delete('/:id', protect, roleMiddleware('admin'), deleteBlog);

export default router;
