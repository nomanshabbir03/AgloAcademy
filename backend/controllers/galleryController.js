import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import GalleryPost from '../models/GalleryPost.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_POSTS = 10;

const deleteFilesSafely = (paths = []) => {
  paths.forEach((relPath) => {
    if (!relPath || typeof relPath !== 'string') return;
    // Only allow deletion inside uploads/gallery
    if (!relPath.startsWith('/uploads/gallery/')) return;

    const fullPath = path.join(__dirname, '..', relPath.replace(/^\//, ''));
    fs.stat(fullPath, (err, stats) => {
      if (err || !stats.isFile()) return;
      fs.unlink(fullPath, () => {});
    });
  });
};

export const getGalleryPosts = async (req, res) => {
  try {
    const posts = await GalleryPost.find()
      .sort({ createdAt: -1 })
      .limit(MAX_POSTS);

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching gallery posts:', error.message);
    res.status(500).json({ message: 'Failed to fetch gallery posts' });
  }
};

export const getGalleryPostById = async (req, res) => {
  try {
    const post = await GalleryPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Gallery post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching gallery post:', error.message);
    res.status(500).json({ message: 'Failed to fetch gallery post' });
  }
};

export const createGalleryPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const images = files.map((file) => `/uploads/gallery/${file.filename}`);

    const post = await GalleryPost.create({ caption, images });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating gallery post:', error.message);
    res.status(500).json({ message: 'Failed to create gallery post' });
  }
};

export const updateGalleryPost = async (req, res) => {
  try {
    const { caption, removeImages } = req.body;
    const files = req.files || [];

    const post = await GalleryPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Gallery post not found' });
    }

    // Remove selected images
    let currentImages = [...post.images];
    let removedImages = [];

    if (Array.isArray(removeImages) && removeImages.length) {
      removedImages = currentImages.filter((img) => removeImages.includes(img));
      currentImages = currentImages.filter((img) => !removeImages.includes(img));
    }

    // Add newly uploaded images
    if (files.length) {
      const newImages = files.map((file) => `/uploads/gallery/${file.filename}`);
      currentImages.push(...newImages);
    }

    if (!currentImages.length) {
      return res.status(400).json({ message: 'A gallery post must have at least one image' });
    }

    post.caption = typeof caption === 'string' ? caption : post.caption;
    post.images = currentImages;
    await post.save();

    // Delete removed files from disk
    deleteFilesSafely(removedImages);

    res.status(200).json(post);
  } catch (error) {
    console.error('Error updating gallery post:', error.message);
    res.status(500).json({ message: 'Failed to update gallery post' });
  }
};

export const deleteGalleryPost = async (req, res) => {
  try {
    const post = await GalleryPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Gallery post not found' });
    }

    deleteFilesSafely(post.images || []);

    res.status(200).json({ message: 'Gallery post deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery post:', error.message);
    res.status(500).json({ message: 'Failed to delete gallery post' });
  }
};
