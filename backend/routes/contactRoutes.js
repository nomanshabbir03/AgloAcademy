import express from 'express';
import { sendInquiry } from '../controllers/contactController.js';

const router = express.Router();

// Contact/Inquiry routes
router.post('/', sendInquiry);

export default router;

