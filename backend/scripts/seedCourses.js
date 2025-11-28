import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Course from '../models/Course.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedCourses = async () => {
  try {
    await connectDB();
    // Clear existing courses so we have a clean, predictable dataset
    const existing = await Course.countDocuments();
    if (existing > 0) {
      console.log(`Removing existing courses (${existing}) before seeding...`);
      await Course.deleteMany({});
    }

    const courses = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
        instructor: 'John Doe',
        thumbnail: '/images/courses/web-dev.jpg',
        duration: '8 weeks',
        level: 'Beginner',
        price: 0,
        isFree: true,
        type: 'free',
        googleDriveLink: 'https://drive.google.com/webdev-free-course',
      },
      {
        title: 'Advanced React & Frontend Engineering',
        description: 'Deep dive into React, performance optimization, and frontend architecture.',
        instructor: 'Jane Smith',
        thumbnail: '/images/courses/react-advanced.jpg',
        duration: '10 weeks',
        level: 'Advanced',
        price: 199,
        isFree: false,
        type: 'paid',
        googleDriveLink: 'https://drive.google.com/react-advanced-paid-course',
      },
      {
        title: 'Data Structures & Algorithms for Interviews',
        description: 'Prepare for technical interviews with essential DS&A concepts and problems.',
        instructor: 'Alex Johnson',
        thumbnail: '/images/courses/dsa.jpg',
        duration: '12 weeks',
        level: 'Intermediate',
        price: 149,
        isFree: false,
        type: 'paid',
        googleDriveLink: 'https://drive.google.com/dsa-paid-course',
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Understand design principles, user research, and prototyping for modern products.',
        instructor: 'Emily Brown',
        thumbnail: '/images/courses/ui-ux.jpg',
        duration: '6 weeks',
        level: 'Beginner',
        price: 0,
        isFree: true,
        type: 'free',
        googleDriveLink: 'https://drive.google.com/ui-ux-free-course',
      },
    ];

    await Course.insertMany(courses);

    console.log('Course seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Course seeding failed:', error.message);
    process.exit(1);
  }
};

seedCourses();
