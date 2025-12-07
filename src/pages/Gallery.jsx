import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGalleryPosts } from '../api/gallery';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const resolveImageUrl = (src) => {
  if (!src) return src;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  // Assume backend serves /uploads
  return `${API_BASE_URL}${src}`;
};

const ImageLightbox = ({ images, index, onClose, onPrev, onNext }) => {
  if (!images || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div
          className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={resolveImageUrl(images[index])}
            alt="Gallery item"
            className="max-h-[80vh] w-auto max-w-full rounded-lg shadow-2xl object-contain"
            loading="lazy"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/70"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/70"
              >
                ›
              </button>
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === index ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full bg-black/60 text-white px-3 py-1 text-sm hover:bg-black/80"
          >
            Close
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const GalleryCard = ({ post, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = post.images && post.images.length > 1;

  const handlePrev = (e) => {
    e.stopPropagation();
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev + 1) % post.images.length);
  };

  const created = post.createdAt ? new Date(post.createdAt) : null;

  return (
    <motion.article
      layout
      className="card overflow-hidden flex flex-col bg-white/80 backdrop-blur shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary-muted/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image / carousel */}
      <div className="relative bg-gray-100 cursor-pointer" onClick={() => onImageClick(post, currentIndex)}>
        {post.images && post.images.length > 0 && (
          <img
            src={resolveImageUrl(post.images[currentIndex])}
            alt={post.caption || 'Gallery image'}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
        )}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-1.5 hover:bg-black/60"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-1.5 hover:bg-black/60"
            >
              ›
            </button>
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
              {post.images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Caption and meta */}
      <div className="p-4 flex flex-col gap-2">
        {post.caption && (
          <p className="text-gray-800 text-sm md:text-base whitespace-pre-line">
            {post.caption}
          </p>
        )}
        {created && (
          <p className="text-xs text-gray-500">
            {created.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}{' '}
            ·{' '}
            {created.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </motion.article>
  );
};

const Gallery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['gallery-posts'],
    queryFn: fetchGalleryPosts,
  });

  const [lightboxPost, setLightboxPost] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (post, index) => {
    setLightboxPost(post);
    setLightboxIndex(index || 0);
  };

  const handleCloseLightbox = () => {
    setLightboxPost(null);
    setLightboxIndex(0);
  };

  const handlePrevLightbox = () => {
    if (!lightboxPost || !lightboxPost.images?.length) return;
    setLightboxIndex((prev) => (prev - 1 + lightboxPost.images.length) % lightboxPost.images.length);
  };

  const handleNextLightbox = () => {
    if (!lightboxPost || !lightboxPost.images?.length) return;
    setLightboxIndex((prev) => (prev + 1) % lightboxPost.images.length);
  };

  const posts = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-screen bg-primary-muted/5">
      <section className="section-padding">
        <div className="container-custom">
          <header className="mb-10 text-center">
            <motion.h1
              className="text-3xl md:text-4xl font-heading font-bold text-primary-dark mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Our Activities & Gallery
            </motion.h1>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Explore highlights from our events, workshops, and student activities. Newest moments
              appear first, just like a social feed.
            </motion.p>
          </header>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card h-64 bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {isError && !isLoading && (
            <p className="text-center text-red-500 text-sm">
              Failed to load gallery posts. Please try again later.
            </p>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <p className="text-center text-gray-500 text-sm">
              No posts yet. Check back soon to see our latest activities.
            </p>
          )}

          {!isLoading && !isError && posts.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
            >
              {posts.map((post) => (
                <GalleryCard key={post._id || post.id} post={post} onImageClick={handleOpenLightbox} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {lightboxPost && (
        <ImageLightbox
          images={lightboxPost.images}
          index={lightboxIndex}
          onClose={handleCloseLightbox}
          onPrev={handlePrevLightbox}
          onNext={handleNextLightbox}
        />
      )}
    </div>
  );
};

export default Gallery;
