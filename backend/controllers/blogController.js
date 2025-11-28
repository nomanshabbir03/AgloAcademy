import Blog from '../models/Blog.js';

export const getBlogs = async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ title: regex }, { excerpt: regex }, { content: regex }];
    }

    const blogs = await Blog.find(query).sort({ publishedAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    return res.status(200).json(blog);
  } catch (error) {
    console.error('Get blog details error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch blog details' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, image, readTime, publishedAt } = req.body;

    if (!title || !excerpt || !content) {
      return res
        .status(400)
        .json({ message: 'Title, excerpt, and content are required for a blog post' });
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category,
      image,
      readTime,
      publishedAt,
    });

    return res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error.message);
    return res.status(500).json({ message: 'Failed to create blog post' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updates = req.body;

    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error('Update blog error:', error.message);
    return res.status(500).json({ message: 'Failed to update blog post' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    return res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error.message);
    return res.status(500).json({ message: 'Failed to delete blog post' });
  }
};
