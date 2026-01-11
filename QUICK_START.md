# Quick Start Guide

Get your Instagram Bio Link up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Firebase account (free tier works)

## Setup Steps

### 1. Install Dependencies (1 minute)

```bash
cd instagram-bio-link
npm install
```

### 2. Set Up Firebase (2 minutes)

1. Go to https://console.firebase.google.com/
2. Create a new project (or use existing)
3. Enable Firestore Database:
   - Click "Firestore Database" → "Create database"
   - Start in test mode
   - Choose a location
4. Get your config:
   - Project Settings (gear icon) → General
   - Scroll to "Your apps" → Click web icon (`</>`)
   - Register app → Copy config values

### 3. Configure Environment (1 minute)

1. Copy `.env.example` to `.env`
2. Fill in your Firebase config values from step 2

```env
REACT_APP_FIREBASE_API_KEY=your-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Set Firestore Rules (1 minute)

1. Firebase Console → Firestore Database → Rules tab
2. Paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{requestId} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'phone', 'serviceType', 'budget', 'timeline', 'message', 'status', 'createdAt']);
      allow read, update, delete: if false;
    }
  }
}
```

3. Click "Publish"

### 5. Start the App!

```bash
npm start
```

Open http://localhost:3000 and test it out! 🎉

## What You Get

✅ Landing page with 6 services  
✅ Service-specific forms with custom fields  
✅ General inquiry form  
✅ All submissions saved to Firebase  
✅ Mobile-optimized design  
✅ Beautiful Instagram-style gradients  

## View Submissions

1. Firebase Console → Firestore Database
2. Click `requests` collection
3. See all form submissions!

## Next Steps

- Customize services in `src/config/services.ts`
- Deploy to Vercel/Netlify (see README.md)
- Add your Instagram link to your bio!

## Need Help?

- Check `README.md` for detailed documentation
- Check `FIREBASE_SETUP.md` for Firebase-specific help
- Check browser console for errors
- Verify `.env` file has all variables

---

**Pro Tip**: Test the form before deploying to make sure Firebase is working!
