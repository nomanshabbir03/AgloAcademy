import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['free', 'paid'],
      default: 'paid',
    },
    googleDriveLink: {
      type: String,
    },
    modules: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Keep isFree and type in sync
courseSchema.pre('save', function (next) {
  if (this.isFree === true) {
    this.type = 'free';
  } else if (this.isFree === false) {
    this.type = 'paid';
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
