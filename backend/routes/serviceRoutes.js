import express from 'express';
import { protect, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getServiceById);

router.post('/', protect, roleMiddleware('admin'), createService);
router.patch('/:id', protect, roleMiddleware('admin'), updateService);
router.delete('/:id', protect, roleMiddleware('admin'), deleteService);

export default router;
