import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Validate required environment variables
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.REACT_APP_FIREBASE_APP_ID;

// Check for missing required environment variables
const missingVars: string[] = [];
if (!apiKey) missingVars.push('REACT_APP_FIREBASE_API_KEY');
if (!authDomain) missingVars.push('REACT_APP_FIREBASE_AUTH_DOMAIN');
if (!projectId) missingVars.push('REACT_APP_FIREBASE_PROJECT_ID');
if (!storageBucket) missingVars.push('REACT_APP_FIREBASE_STORAGE_BUCKET');
if (!messagingSenderId) missingVars.push('REACT_APP_FIREBASE_MESSAGING_SENDER_ID');
if (!appId) missingVars.push('REACT_APP_FIREBASE_APP_ID');

if (missingVars.length > 0) {
  console.warn(
    `Missing Firebase environment variables: ${missingVars.join(', ')}\n` +
    'Please create a .env file in the root directory with these variables.\n' +
    'See .env.example for a template.'
  );
}

// Firebase configuration
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
