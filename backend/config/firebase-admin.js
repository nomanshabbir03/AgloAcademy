import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY
} from './config.js';

console.log('Initializing Firebase Admin...');

let adminApp;
let adminAuth;

try {
  // Format the private key correctly by replacing escaped newlines
  const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  
  const firebaseAdminConfig = {
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey
    })
  };
  
  console.log('Firebase Admin - Using project:', FIREBASE_PROJECT_ID);

  // Initialize only if not already initialized
  adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
  adminAuth = getAuth(adminApp);

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
  
  if (error.code === 'app/duplicate-app') {
    console.log('ℹ️  Firebase app already exists, using existing instance');
    adminApp = getApps()[0];
    adminAuth = getAuth(adminApp);
  } else {
    console.error('❌ Failed to initialize Firebase Admin');
    console.error('Error details:', error);
    process.exit(1);
  }
}

export {
  adminApp,
  adminAuth
};