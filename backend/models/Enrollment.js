import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
    paymentNote: {
      type: String,
      trim: true,
    },
    paymentScreenshotUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
