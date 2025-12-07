import mongoose from 'mongoose';

const galleryPostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      validate: [
        (arr) => Array.isArray(arr) && arr.length > 0,
        'At least one image is required for a gallery post',
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GalleryPost = mongoose.model('GalleryPost', galleryPostSchema);

export default GalleryPost;
