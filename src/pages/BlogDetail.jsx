import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { fetchBlogById } from '../api/blog';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBlogById(id);
        setPost(data);
      } catch (err) {
        console.error('Failed to load blog post:', err);
        const message =
          err?.response?.status === 404
            ? 'The requested blog post was not found.'
            : err?.response?.data?.message || 'Failed to load blog post. Please try again later.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm text-primary-100 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm uppercase tracking-wide text-primary-100 mb-2">
              {post?.category || 'Blog'}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
              {post?.title || (loading ? 'Loading...' : 'Blog Post')}
            </h1>
            {post && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-primary-100/90">
                <span className="inline-flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                </span>
                {post.readTime && (
                  <span className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="container-custom max-w-3xl">
          {loading && (
            <p className="text-sm text-gray-600">Loading blog post...</p>
          )}

          {error && !loading && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && post && (
            <>
              {post.image && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-72 object-cover"
                  />
                </div>
              )}

              {post.excerpt && (
                <p className="text-lg text-gray-700 mb-6">{post.excerpt}</p>
              )}

              <div className="prose prose-gray max-w-none text-gray-800 text-base leading-relaxed">
                {post.content
                  ?.split(/\n{2,}/)
                  .map((para, idx) => (
                    <p key={idx} className="mb-4 whitespace-pre-wrap">
                      {para.trim()}
                    </p>
                  ))}
              </div>
            </>
          )}

          {!loading && !error && !post && (
            <p className="text-sm text-gray-600">Blog post not found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
