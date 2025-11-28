import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingWithEmail = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingWithEmail) {
      return res.status(409).json({ message: 'Another account already uses this email' });
    }

    req.user.name = name;
    req.user.email = email;
    await req.user.save();

    return res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      enrolledCourses: req.user.enrolledCourses,
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, oldPassword } = req.body;

    const currentOrOldPassword = currentPassword || oldPassword;

    if (!currentOrOldPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentOrOldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error.message);
    return res.status(500).json({ message: 'Failed to update password' });
  }
};
