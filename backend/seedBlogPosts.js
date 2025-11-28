import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Blog from './models/Blog.js';

dotenv.config();

const seedBlogPosts = async () => {
  try {
    await connectDB();

    const existing = await Blog.countDocuments();
    if (existing > 0) {
      console.log(`Blog collection already has ${existing} documents. Skipping seed.`);
      await mongoose.connection.close();
      process.exit(0);
    }

    const posts = [
      {
        title: 'The Future of Artificial Intelligence in Education',
        excerpt:
          'Explore how AI is transforming the educational landscape and what it means for students and educators alike.',
        content:
          'Artificial Intelligence (AI) is reshaping education by enabling personalized learning experiences, intelligent tutoring systems, and data-driven decision making... ',
        category: 'AI',
        image:
          'https://images.unsplash.com/photo-1677442135136-760c813d0c85?w=600&h=400&fit=crop',
        readTime: '5 min read',
      },
      {
        title: 'Mastering Digital Marketing in 2025',
        excerpt:
          'Discover the latest trends and strategies in digital marketing that are driving success this year.',
        content:
          'Digital marketing continues to evolve quickly. From short-form video to AI-driven ad optimization, modern marketers need a blend of creativity and analytics...',
        category: 'Digital Marketing',
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        readTime: '7 min read',
      },
      {
        title: 'Graphic Design Principles Every Beginner Should Know',
        excerpt:
          'Learn the fundamental principles that will take your graphic design skills to the next level.',
        content:
          'Great graphic design is built on a few timeless principles: hierarchy, contrast, alignment, repetition, and balance. Understanding these helps you create visuals that communicate clearly...',
        category: 'Graphic Design',
        image:
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        readTime: '6 min read',
      },
      {
        title: 'Video Editing Tips for Stunning Visuals',
        excerpt:
          'Professional video editing techniques to make your videos stand out from the crowd.',
        content:
          'From pacing and rhythm to color grading and sound design, video editing is where your story truly comes together. Start with a solid storyboard, then refine your cuts...',
        category: 'Video Editing',
        image:
          'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
        readTime: '8 min read',
      },
    ];

    await Blog.insertMany(posts);
    console.log(`Inserted ${posts.length} blog posts.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Blog seed failed:', err.message);
    try {
      await mongoose.connection.close();
    } catch (_) {}
    process.exit(1);
  }
};

seedBlogPosts();
