# Files to Open in Cursor

This document lists the key files you should open in Cursor to start building and customizing your Instagram Bio Link app.

## 🎯 Essential Files to Open

### Configuration & Setup
1. **`.env.example`** - Template for environment variables (copy to `.env` and fill in)
2. **`package.json`** - Dependencies and scripts
3. **`tailwind.config.js`** - Tailwind CSS configuration (colors, gradients, animations)
4. **`tsconfig.json`** - TypeScript configuration

### Core Application Files
5. **`src/App.tsx`** - Main app component with routing
6. **`src/index.tsx`** - App entry point
7. **`src/firebase.ts`** - Firebase initialization and configuration

### Pages (Main UI)
8. **`src/pages/Landing.tsx`** - Landing page with services grid
9. **`src/pages/ServiceForm.tsx`** - Service-specific form page (NEW - dynamic forms per service)
10. **`src/pages/RequestForm.tsx`** - General inquiry form page

### Services Configuration (IMPORTANT - Customize Here!)
11. **`src/config/services.ts`** - ⭐ Service definitions with custom fields (EDIT THIS to customize services)

### Components (Reusable UI)
12. **`src/components/ServiceCard.tsx`** - Service card component
13. **`src/components/FormField.tsx`** - Form input field component
14. **`src/components/Button.tsx`** - Button component
15. **`src/components/Toast.tsx`** - Toast notification component
16. **`src/components/LoadingSpinner.tsx`** - Loading spinner component

### Services & Utilities
17. **`src/services/formService.ts`** - Firebase form submission service
18. **`src/utils/formValidation.ts`** - Form validation utilities
19. **`src/types/index.ts`** - TypeScript type definitions

### Styling
20. **`src/index.css`** - Global styles and animations

### Documentation
21. **`README.md`** - Complete setup and usage guide
22. **`FIREBASE_SETUP.md`** - Detailed Firebase setup instructions
23. **`QUICK_START.md`** - Quick setup guide

## 🚀 Recommended Opening Order

### For First-Time Setup:
1. `QUICK_START.md` - Start here!
2. `.env.example` - Copy and configure
3. `src/config/services.ts` - Customize your services
4. `src/pages/Landing.tsx` - See the main page

### For Customization:
1. `src/config/services.ts` - **Start here** - Add/edit services and custom fields
2. `src/pages/Landing.tsx` - Customize landing page layout
3. `tailwind.config.js` - Customize colors and gradients
4. `src/index.css` - Customize global styles and animations

### For Understanding the Code:
1. `src/App.tsx` - Routing structure
2. `src/pages/ServiceForm.tsx` - How service-specific forms work
3. `src/services/formService.ts` - How form submissions work
4. `src/types/index.ts` - Type definitions

## 📝 Quick Customization Guide

### To Add a New Service:
Edit `src/config/services.ts` and add a new service object to the `SERVICES` array.

### To Change Colors:
Edit `tailwind.config.js` → `theme.extend.colors` and `backgroundImage`.

### To Modify Form Fields:
Edit `src/config/services.ts` → `customFields` array in each service.

### To Change Layout:
Edit `src/pages/Landing.tsx` for the landing page layout.

## 🔍 File Structure Overview

```
instagram-bio-link/
├── .env.example              ← Copy to .env and configure
├── src/
│   ├── config/
│   │   └── services.ts       ← ⭐ EDIT THIS for services
│   ├── pages/
│   │   ├── Landing.tsx       ← Landing page
│   │   ├── ServiceForm.tsx   ← Service-specific forms
│   │   └── RequestForm.tsx   ← General form
│   ├── components/           ← Reusable UI components
│   ├── services/
│   │   └── formService.ts    ← Firebase submission
│   ├── types/
│   │   └── index.ts          ← TypeScript types
│   ├── utils/
│   │   └── formValidation.ts ← Form validation
│   ├── App.tsx               ← Routing
│   ├── firebase.ts           ← Firebase config
│   └── index.tsx             ← Entry point
└── README.md                 ← Full documentation
```

## 💡 Pro Tips

1. **Always start with `src/config/services.ts`** - This is where you customize your services
2. **Keep `.env` file secure** - Never commit it to git
3. **Test locally first** - Run `npm start` and test forms before deploying
4. **Check Firebase Console** - View submissions in Firestore Database
5. **Use TypeScript** - Leverage autocomplete and type checking

---

Happy coding! 🎉
