import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  purpose: {
    type: String,
    enum: ['email-verification', 'password-reset'],
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3,
  },
  lastAttempt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  // Automatically delete documents after 1 hour
  expires: 3600,
});

// Index for faster querying
// otpSchema.index({ email: 1, purpose: 1 });

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
