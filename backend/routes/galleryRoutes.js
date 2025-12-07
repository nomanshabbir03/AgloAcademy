import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getGalleryPosts,
  getGalleryPostById,
  createGalleryPost,
  updateGalleryPost,
  deleteGalleryPost,
} from '../controllers/galleryController.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'gallery');
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
    cb(null, `${timestamp}-${random}-${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Public routes
router.get('/', getGalleryPosts);
router.get('/:id', getGalleryPostById);

// Admin routes
router.post('/', protect, roleMiddleware('admin'), upload.array('images', 10), createGalleryPost);
router.patch('/:id', protect, roleMiddleware('admin'), upload.array('images', 10), updateGalleryPost);
router.delete('/:id', protect, roleMiddleware('admin'), deleteGalleryPost);

export default router;
