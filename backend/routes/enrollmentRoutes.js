import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  createEnrollmentRequest,
  approveEnrollment,
  rejectEnrollment,
  getEnrollments,
  getEnrollmentStatus,
  getMyEnrollments,
} from '../controllers/enrollmentController.js';

const router = express.Router();

// Configure storage for payment screenshots
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join('uploads', 'payments'));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

// Student creates a pending enrollment request (optionally with payment screenshot)
router.post(
  '/:courseId',
  protect,
  upload.single('paymentScreenshot'),
  createEnrollmentRequest
);

// Admin approves an enrollment
router.patch('/:id/approve', protect, roleMiddleware('admin'), approveEnrollment);

// Admin rejects an enrollment
router.patch('/:id/reject', protect, roleMiddleware('admin'), rejectEnrollment);

// Admin can list all enrollments
router.get('/', protect, roleMiddleware('admin'), getEnrollments);

// Current user can list their own enrollments
router.get('/my', protect, getMyEnrollments);

// Student can check enrollment status for a specific course
router.get('/status/:courseId', protect, getEnrollmentStatus);

export default router;
