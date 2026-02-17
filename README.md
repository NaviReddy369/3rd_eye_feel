# Instagram Bio Link - Service Request Platform

A modern, mobile-optimized link-in-bio page for showcasing services and collecting client requests. Built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

✨ **Service-Specific Forms** - Each service has its own unique form with custom fields tailored to that service type

🎨 **Beautiful UI** - Instagram-inspired gradient design with smooth animations and glassmorphism effects

📱 **Mobile-First** - Optimized for mobile devices, perfect for Instagram link-in-bio

🔥 **Firebase Integration** - Secure form submissions stored in Firestore for easy team access

⚡ **Fast & Lightweight** - Built with React 19 and optimized for performance

## Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- A Firebase account (free tier works fine)
- Git (optional)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd instagram-bio-link
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   a. Go to [Firebase Console](https://console.firebase.google.com/)
   
   b. Create a new project (or use existing)
   
   c. Enable Firestore Database:
      - Go to "Firestore Database" in the sidebar
      - Click "Create database"
      - Start in test mode (we'll set up rules later)
      - Choose a location closest to your users
   
   d. Get your Firebase config:
      - Go to Project Settings (gear icon) > General
      - Scroll to "Your apps" section
      - Click the web icon (`</>`) to add a web app
      - Register your app with a nickname
      - Copy the Firebase configuration object

4. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase configuration values:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key-here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

5. **Set up Firestore Security Rules**
   
   Go to Firestore Database > Rules and use:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /requests/{requestId} {
         // Allow anyone to create requests (for form submissions)
         allow create: if request.resource.data.keys().hasAll(['name', 'email', 'phone', 'serviceType', 'budget', 'timeline', 'message', 'status', 'createdAt']);
         
         // Only allow reading your own requests (adjust based on your auth setup)
         allow read: if false; // Set to true if you implement authentication
         
         // No updates or deletes from client (handle via admin console)
         allow update, delete: if false;
       }
     }
   }
   ```
   
   Click "Publish" to save the rules.

6. **Create Firestore Collection**
   
   The app will automatically create the `requests` collection when the first form is submitted. No manual setup needed!

7. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
instagram-bio-link/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── FormField.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ServiceCard.tsx
│   │   └── Toast.tsx
│   ├── config/
│   │   └── services.ts     # Service definitions with custom fields
│   ├── pages/
│   │   ├── Landing.tsx     # Main landing page
│   │   ├── RequestForm.tsx # General inquiry form
│   │   └── ServiceForm.tsx # Service-specific forms
│   ├── services/
│   │   └── formService.ts  # Firebase form submission service
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── utils/
│   │   └── formValidation.ts # Form validation utilities
│   ├── App.tsx             # Main app component with routing
│   ├── firebase.ts         # Firebase initialization
│   ├── index.tsx           # App entry point
│   └── index.css           # Global styles
├── .env.example            # Environment variables template
├── package.json
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Customizing Services

Edit `src/config/services.ts` to customize your services:

```typescript
{
  id: 'your-service-id',
  name: 'Your Service Name',
  description: 'Service description',
  icon: '🎯', // Emoji or icon
  gradient: 'ig-gradient', // or 'ig-gradient-purple' or 'ig-gradient-pink'
  formRoute: '/request/your-service-id',
  customFields: [
    {
      name: 'fieldName',
      label: 'Field Label',
      type: 'text', // 'text' | 'textarea' | 'select' | 'number'
      required: true,
      placeholder: 'Placeholder text',
      options: [ // Only for 'select' type
        { value: 'option1', label: 'Option 1' },
      ],
      validation: (value) => { // Optional custom validation
        if (value.length < 5) return 'Must be at least 5 characters';
        return undefined;
      },
    },
  ],
}
```

## Viewing Submissions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Firestore Database"
4. Click on the `requests` collection
5. View all form submissions with timestamps

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard (Settings > Environment Variables)
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Add new site from Git
4. Add environment variables (Site settings > Environment variables)
5. Build command: `npm run build`
6. Publish directory: `build`
7. Deploy!

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy --only hosting`

### Live site: public AI (Ollama) API

For the **live Firebase site** to use your Ollama model (chat, implementation guide) for **all visitors**:

1. Run the **ollama-proxy** on the same machine as Ollama and expose it with **Tailscale Funnel**: see [`ollama-proxy/README.md`](ollama-proxy/README.md).
2. Set the proxy URL for the **Cloud Function** in `functions/.env`:  
   `OLLAMA_PROXY_URL=https://your-machine.your-tailnet.ts.net`  
   (The repo includes a default; change it if your Funnel URL is different.)
3. Deploy functions and hosting:  
   `firebase deploy --only functions` then `npm run build` and `firebase deploy --only hosting`.

The site uses the `ollamaProxy` Cloud Function (no deprecated `functions.config()`); the function reads `OLLAMA_PROXY_URL` from `functions/.env` at deploy time.

## Customization

### Colors & Gradients

Edit `tailwind.config.js` to customize colors and gradients:

```javascript
backgroundImage: {
  'ig-gradient': 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)',
  // Add your custom gradients
}
```

### Styling

- Global styles: `src/index.css`
- Component styles: Tailwind classes in component files
- Custom animations: Defined in `src/index.css`

## Troubleshooting

### Firebase Connection Issues

- Verify all environment variables in `.env` are correct
- Check Firebase console for API restrictions
- Ensure Firestore is enabled in Firebase Console

### Form Not Submitting

- Check browser console for errors
- Verify Firestore security rules allow creation
- Check Firebase project quotas (free tier has limits)

### Build Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (requires 16+)

## Support

For issues or questions:
1. Check the Firebase Console for form submissions
2. Review browser console for errors
3. Verify environment variables are set correctly

## License

MIT License - feel free to use this for your projects!

---

Built with ❤️ for Instagram link-in-bio pages
