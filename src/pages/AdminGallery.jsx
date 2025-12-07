import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  fetchGalleryPosts,
  createGalleryPost,
  updateGalleryPost,
  deleteGalleryPost,
} from '../api/gallery';
import { useToast } from '../context/ToastContext.jsx';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const resolveImageUrl = (src) => {
  if (!src) return src;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${API_BASE_URL}${src}`;
};

const initialFormState = {
  caption: '',
  files: [],
  removeImages: [],
};

const AdminGallery = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formState, setFormState] = useState(initialFormState);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery-posts-admin'],
    queryFn: fetchGalleryPosts,
  });

  const posts = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const resetForm = () => {
    setEditingPost(null);
    setFormState(initialFormState);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (post) => {
    setEditingPost(post);
    setFormState({
      caption: post.caption || '',
      files: [],
      removeImages: [],
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormState((prev) => ({ ...prev, files }));
  };

  const toggleRemoveImage = (imagePath) => {
    setFormState((prev) => {
      const exists = prev.removeImages.includes(imagePath);
      return {
        ...prev,
        removeImages: exists
          ? prev.removeImages.filter((p) => p !== imagePath)
          : [...prev.removeImages, imagePath],
      };
    });
  };

  const createMutation = useMutation({
    mutationFn: async ({ caption, files }) => {
      const formData = new FormData();
      if (caption) formData.append('caption', caption);
      files.forEach((file) => formData.append('images', file));

      if (!files.length) {
        throw new Error('Please select at least one image for the post.');
      }

      return createGalleryPost(formData);
    },
    onSuccess: () => {
      showToast('Gallery post created successfully', 'success');
      queryClient.invalidateQueries(['gallery-posts']);
      queryClient.invalidateQueries(['gallery-posts-admin']);
      closeForm();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error.message || 'Failed to create post';
      showToast(message, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, caption, files, removeImages }) => {
      const formData = new FormData();
      if (caption) formData.append('caption', caption);
      if (Array.isArray(removeImages)) {
        removeImages.forEach((img) => formData.append('removeImages', img));
      }
      files.forEach((file) => formData.append('images', file));

      return updateGalleryPost(id, formData);
    },
    onSuccess: () => {
      showToast('Gallery post updated successfully', 'success');
      queryClient.invalidateQueries(['gallery-posts']);
      queryClient.invalidateQueries(['gallery-posts-admin']);
      closeForm();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error.message || 'Failed to update post';
      showToast(message, 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => deleteGalleryPost(id),
    onSuccess: () => {
      showToast('Gallery post deleted successfully', 'success');
      queryClient.invalidateQueries(['gallery-posts']);
      queryClient.invalidateQueries(['gallery-posts-admin']);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error.message || 'Failed to delete post';
      showToast(message, 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingPost) {
      updateMutation.mutate({
        id: editingPost._id || editingPost.id,
        caption: formState.caption,
        files: formState.files,
        removeImages: formState.removeImages,
      });
    } else {
      createMutation.mutate({
        caption: formState.caption,
        files: formState.files,
      });
    }
  };

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div className="min-h-screen bg-primary-muted/5 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary-dark">
              Gallery Posts
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Manage the public gallery feed shown on the Gallery page.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="btn-primary whitespace-nowrap"
          >
            Create New Post
          </button>
        </div>

        {/* Form */}
        {isFormOpen && (
          <motion.form
            onSubmit={handleSubmit}
            className="card mb-10 p-6 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption / Description
              </label>
              <textarea
                rows={3}
                value={formState.caption}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, caption: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
                placeholder="Write a short caption about this activity..."
              />
            </div>

            {editingPost && editingPost.images?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Existing Images</p>
                <div className="flex flex-wrap gap-3">
                  {editingPost.images.map((img) => (
                    <label key={img} className="relative inline-block">
                      <img
                        src={resolveImageUrl(img)}
                        alt="Existing"
                        className="h-20 w-32 object-cover rounded-md border border-gray-200"
                      />
                      <input
                        type="checkbox"
                        className="absolute top-1 right-1 h-4 w-4"
                        checked={formState.removeImages.includes(img)}
                        onChange={() => toggleRemoveImage(img)}
                      />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Checked images will be removed when you save.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingPost ? 'Add More Images' : 'Upload Images'} (JPG, PNG, WEBP, max 5MB each)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleFilesChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
              />
              {formState.files.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected {formState.files.length} file(s).
                </p>
              )}
            </div>

            {!editingPost && (
              <p className="text-xs text-gray-500">
                At least one image is required for a new post.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Posts list */}
        <div className="card p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No gallery posts yet. Create your first post to populate the public gallery.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <div
                  key={post._id || post.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col"
                >
                  {post.images && post.images.length > 0 && (
                    <img
                      src={resolveImageUrl(post.images[0])}
                      alt={post.caption || 'Gallery thumbnail'}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <p className="text-sm text-gray-800 line-clamp-3">
                      {post.caption || 'No caption'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Images: {post.images?.length || 0}
                    </p>
                    {post.createdAt && (
                      <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(post)}
                        className="px-3 py-1 rounded-md text-xs border border-primary-accent text-primary-accent hover:bg-primary-accent/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm('Are you sure you want to delete this post?')) return;
                          deleteMutation.mutate(post._id || post.id);
                        }}
                        className="px-3 py-1 rounded-md text-xs border border-red-500 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
