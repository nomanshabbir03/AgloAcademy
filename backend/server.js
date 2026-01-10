import './config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courseRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

console.log('Starting server with environment:', process.env.NODE_ENV || 'development');

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup for frontend with credentials
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
app.use(cors({
  origin: FRONTEND_URL,   // only allow your frontend
  credentials: true,      // allow cookies and Authorization headers
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB
const connectDB = async () => {
  const { MONGODB_URI } = await import('./config/config.js');

  console.log('Connecting to MongoDB...');
  console.log('MongoDB URI:', MONGODB_URI ? '***' : 'NOT SET');

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,          // Close sockets after 45s
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('ℹ️  MongoDB disconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Retry logic for MongoDB connection
const MAX_RETRIES = 3;
let retryCount = 0;

const connectWithRetry = async () => {
  try {
    await connectDB();
  } catch (error) {
    retryCount++;
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying MongoDB connection (${retryCount}/${MAX_RETRIES})...`);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    } else {
      console.error('❌ Max retries reached. Could not connect to MongoDB');
      process.exit(1);
    }
  }
};

connectWithRetry();

// Error handling middleware (must come after all routes)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
