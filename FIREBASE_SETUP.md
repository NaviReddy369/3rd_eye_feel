# Firebase Setup Guide

This guide will walk you through setting up Firebase for your Instagram Bio Link app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "instagram-bio-link")
4. Click "Continue"
5. (Optional) Disable Google Analytics if you don't need it
6. Click "Create project"
7. Wait for the project to be created, then click "Continue"

## Step 2: Enable Firestore Database

1. In the Firebase Console sidebar, click "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (we'll configure rules later)
4. Choose a location closest to your users
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview" in the sidebar
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Register your app:
   - Enter an app nickname (e.g., "Instagram Bio Link")
   - (Optional) Check "Also set up Firebase Hosting"
   - Click "Register app"
6. Copy the Firebase configuration object - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## Step 4: Set Up Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase config values:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSy...
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123...
   ```

3. **Important**: Restart your development server after creating/updating `.env`

## Step 5: Configure Firestore Security Rules

1. In Firebase Console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{requestId} {
      // Allow anyone to create requests (for form submissions)
      allow create: if request.resource.data.keys().hasAll([
        'name', 
        'email', 
        'phone', 
        'serviceType', 
        'budget', 
        'timeline', 
        'message', 
        'status', 
        'createdAt'
      ]);
      
      // Prevent client-side reads (for security)
      // View submissions in Firebase Console or set up admin access
      allow read: if false;
      
      // Prevent client-side updates/deletes
      allow update, delete: if false;
    }
  }
}
```

4. Click "Publish" to save the rules

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to your app (usually http://localhost:3000)

3. Fill out and submit a test form

4. Go back to Firebase Console > Firestore Database

5. You should see a new collection called `requests` with your test submission

## Step 7: View Form Submissions

To view form submissions:

1. Go to Firebase Console > Firestore Database
2. Click on the `requests` collection
3. You'll see all submissions with:
   - All form fields (name, email, phone, etc.)
   - `status`: 'new' (you can update this manually as you contact clients)
   - `createdAt`: Timestamp of submission
   - `serviceType`: The service they selected
   - Custom fields specific to each service

## Optional: Set Up Firebase Authentication (Future Enhancement)

If you want to protect the read access to submissions:

1. Enable Authentication in Firebase Console
2. Set up an authentication method (Email/Password recommended)
3. Update security rules to allow authenticated reads:
   ```javascript
   allow read: if request.auth != null;
   ```

## Troubleshooting

### "Missing Firebase environment variables" warning
- Make sure `.env` file exists in the project root
- Verify all environment variables start with `REACT_APP_`
- Restart your development server after creating `.env`

### "Permission denied" error on form submission
- Check Firestore security rules are published
- Verify the rules allow `create` operations
- Check browser console for specific error messages

### Form submissions not appearing
- Check Firestore Database in Firebase Console
- Verify you're looking at the correct project
- Check browser console for errors
- Verify Firestore is enabled (not Realtime Database)

### Quota exceeded errors
- Firebase free tier has limits
- Check Firebase Console > Usage and billing
- Consider upgrading to Blaze plan for higher limits

## Next Steps

- Set up email notifications when forms are submitted (requires Firebase Functions)
- Create an admin dashboard to manage submissions
- Set up automated responses to form submissions
- Add analytics tracking
