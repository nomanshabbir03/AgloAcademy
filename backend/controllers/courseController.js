import Course from '../models/Course.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const getCourses = async (req, res) => {
  try {
    const { search, level, price, featured } = req.query;

    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { instructor: regex },
      ];
    }

    if (level) {
      query.level = level;
    }

    if (price) {
      const maxPrice = Number(price);
      if (!Number.isNaN(maxPrice)) {
        query.price = { $lte: maxPrice };
      }
    }

    if (featured === 'true') {
      query.featured = true;
    } else if (featured === 'false') {
      query.featured = false;
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Get courses error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isFree = course.isFree === true || course.type === 'free';

    if (isFree) {
      return res.status(200).json(course);
    }

    const courseObject = course.toObject();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      delete courseObject.googleDriveLink;
      return res.status(200).json(courseObject);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'devsecret';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      delete courseObject.googleDriveLink;
      return res.status(200).json(courseObject);
    }

    const user = await User.findById(decoded.id).select('enrolledCourses');
    if (!user) {
      delete courseObject.googleDriveLink;
      return res.status(200).json(courseObject);
    }

    const isEnrolled = user.enrolledCourses?.some(
      (cId) => cId.toString() === course._id.toString()
    );

    if (!isEnrolled) {
      delete courseObject.googleDriveLink;
    }

    return res.status(200).json(courseObject);
  } catch (error) {
    console.error('Get course details error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch course details' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      thumbnail,
      duration,
      rating,
      price,
      type,
      googleDriveLink,
      level,
      modules,
      featured,
    } = req.body;

    if (!title || !description || !instructor || !thumbnail || !duration || price == null) {
      return res.status(400).json({ message: 'Missing required course fields' });
    }

    const course = await Course.create({
      title,
      description,
      instructor,
      thumbnail,
      duration,
      rating,
      price,
      type: type === 'paid' ? 'paid' : 'free',
      isFree: type === 'free',
      googleDriveLink,
      level,
      modules,
      featured: featured === true || featured === 'true',
    });

    return res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error.message);
    return res.status(500).json({ message: 'Failed to create course' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.type && !['free', 'paid'].includes(updates.type)) {
      return res.status(400).json({ message: 'Invalid course type' });
    }

    if (updates.type) {
      updates.isFree = updates.type === 'free';
    }

    if (updates.modules && !Array.isArray(updates.modules)) {
      return res.status(400).json({ message: 'Modules must be an array' });
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error('Update course error:', error.message);
    return res.status(500).json({ message: 'Failed to update course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error.message);
    return res.status(500).json({ message: 'Failed to delete course' });
  }
};
