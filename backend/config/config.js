import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Export all environment variables
export const {
  NODE_ENV = 'development',
  PORT = 5000,
  MONGODB_URI,
  JWT_SECRET,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FRONTEND_URL = 'http://localhost:3000',
  RESEND_API_KEY,
  ADMIN_EMAIL,
  FROM_EMAIL,
  SEND_CONFIRMATION_EMAIL = 'true'
} = process.env;

// Validate required environment variables
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`- ${varName}`));
  process.exit(1);
}

// Export a function to get environment variables
export function getEnv(varName, defaultValue = '') {
  return process.env[varName] || defaultValue;
}
