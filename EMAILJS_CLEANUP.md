# EmailJS Code Cleanup Guide

This guide explains how to remove EmailJS code after Firebase Trigger Email extension is installed and working.

**Important:** Only perform cleanup AFTER confirming the Firebase extension is sending emails successfully.

## When to Clean Up

✅ **Do cleanup AFTER:**
- Firebase Trigger Email extension is installed
- Extension is configured with SMTP
- Email template is set up
- You've tested and confirmed emails are being sent
- You've verified emails arrive in inbox

❌ **Don't cleanup BEFORE:**
- Extension is not yet installed
- Extension is not working
- You haven't tested email delivery

## Cleanup Steps

### Step 1: Remove EmailJS Code from formService.ts

**File:** `src/services/formService.ts`

**Current code:**
```typescript
import { sendWelcomeEmail } from './emailService';

// ... and later in the function:
sendWelcomeEmail(formData).catch((error) => {
  console.error('Welcome email failed to send:', error);
});
```

**After cleanup:**
```typescript
// Remove the import
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FormData } from '../types';
// Remove: import { sendWelcomeEmail } from './emailService';

export const submitRequest = async (formData: FormData): Promise<string> => {
  try {
    const submission = {
      ...formData,
      status: 'new' as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'requests'), submission);
    // Remove: sendWelcomeEmail() call - Firebase Extension handles this now

    return docRef.id;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('Failed to submit your request. Please try again.');
  }
};
```

### Step 2: Delete emailService.ts File

**File to delete:** `src/services/emailService.ts`

Simply delete this file - it's no longer needed since Firebase Extension handles emails.

### Step 3: Remove EmailJS Dependency (Optional)

**Command:**
```bash
npm uninstall @emailjs/browser
```

This removes the package from `package.json` and `package-lock.json`.

### Step 4: Remove Environment Variables (Optional)

**File:** `.env`

Remove these lines (if present):
```env
REACT_APP_EMAILJS_SERVICE_ID=...
REACT_APP_EMAILJS_TEMPLATE_ID=...
REACT_APP_EMAILJS_PUBLIC_KEY=...
```

**Note:** Keep the file if you still have other environment variables (like Firebase config).

### Step 5: Update Success Messages (Optional)

The success messages in `RequestForm.tsx` and `ServiceForm.tsx` already mention email being sent. These can stay as-is since emails are still being sent (just via Firebase Extension instead of EmailJS).

If you want to update them to be more generic, you can change:
- "A welcome email has been sent to your inbox" → "A welcome email will be sent to your inbox"
- Or keep it as-is (it's still accurate)

## Verification

After cleanup:

1. **Build should succeed:**
   ```bash
   npm run build
   ```

2. **No errors in console** about EmailJS

3. **Forms still work** - submission to Firestore still works

4. **Emails still send** - Firebase Extension handles this automatically

## What Stays the Same

After cleanup, these remain unchanged:
- Form submission flow
- Firestore document creation
- Success messages to users
- UI/UX of forms
- Email delivery (handled by extension now)

## Benefits of Cleanup

- **Cleaner codebase** - Remove unused code
- **Smaller bundle size** - Remove unused dependency
- **Less complexity** - One less service to maintain
- **More secure** - No client-side email sending

## If You Need to Rollback

If for some reason you need EmailJS back:

1. Reinstall package: `npm install @emailjs/browser`
2. Restore `src/services/emailService.ts` from git history
3. Restore EmailJS code in `formService.ts` from git history
4. Add environment variables back to `.env`

## Summary

Cleanup is **optional** and **safe** after confirming Firebase Extension works. The EmailJS code doesn't interfere with Firebase Extension - it just won't do anything useful anymore.

**Recommended:** Do cleanup after confirming everything works for peace of mind and cleaner code.
