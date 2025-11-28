import Course from '../models/Course.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

export const createEnrollmentRequest = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { paymentNote } = req.body || {};
    const paymentScreenshotUrl = req.file ? `/uploads/payments/${req.file.filename}` : undefined;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id).select('enrolledCourses');

    const alreadyEnrolled = user.enrolledCourses?.some(
      (cId) => cId.toString() === course._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    const existingPending = await Enrollment.findOne({
      user: user._id,
      course: course._id,
      status: 'pending',
    });

    if (existingPending) {
      return res.status(409).json({ message: 'An enrollment request is already pending' });
    }

    const enrollment = await Enrollment.create({
      user: user._id,
      course: course._id,
      status: 'pending',
      paymentNote: paymentNote || undefined,
      paymentScreenshotUrl,
    });

    return res.status(201).json({
      message:
        'Enrollment request submitted and is pending admin approval. You will get access once approved.',
      enrollment,
    });
  } catch (error) {
    console.error('Enrollment request error:', error.message);
    return res.status(500).json({ message: 'Failed to create enrollment request' });
  }
};

export const approveEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id).populate('user').populate('course');
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.status === 'approved') {
      return res.status(409).json({ message: 'Enrollment is already approved' });
    }

    enrollment.status = 'approved';
    await enrollment.save();

    const user = await User.findById(enrollment.user._id).select('enrolledCourses');
    const alreadyEnrolled = user.enrolledCourses?.some(
      (cId) => cId.toString() === enrollment.course._id.toString()
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push(enrollment.course._id);
      await user.save();
    }

    return res.status(200).json({
      message: 'Enrollment approved and course access granted to user',
      enrollment,
    });
  } catch (error) {
    console.error('Approve enrollment error:', error.message);
    return res.status(500).json({ message: 'Failed to approve enrollment' });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title');

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate('course', 'title type');

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error('Get my enrollments error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch your enrollments' });
  }
};

export const getEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    }).select('status');

    if (!enrollment) {
      return res.status(200).json({ status: 'none' });
    }

    return res.status(200).json({ status: enrollment.status });
  } catch (error) {
    console.error('Get enrollment status error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch enrollment status' });
  }
};
