# Firebase Trigger Email Setup Guide

This guide documents the complete email flow for 3rd Eye Feel.

## How It Works

```
User Submits Form
    ↓
Document saved to "requests" collection (Firestore)
    ↓
Cloud Function "sendWelcomeEmailOnRequest" triggers
    ↓
Cloud Function creates document in "mail" collection
    ↓
Trigger Email extension picks up "mail" document
    ↓
Email sent via Brevo SMTP
    ↓
Extension adds "delivery" field to mail document
```

## Components

1. **Form submission** - Your app saves to `requests` (unchanged)
2. **Cloud Function** - `sendWelcomeEmailOnRequest` runs when `requests` gets a new doc
3. **mail collection** - Function writes email payload here
4. **Trigger Email extension** - Reads `mail`, sends via SMTP, updates `delivery` status

## Firestore Security Rules

Use these rules (Firestore Database → Rules → Publish):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{requestId} {
      allow create: if request.resource.data.keys().hasAll([
        'name', 'email', 'phone', 'serviceType', 'budget', 'timeline', 'message', 'status', 'createdAt'
      ]);
      allow read: if false;
      allow update, delete: if false;
    }
    match /mail/{mailId} {
      allow read, write: if false;
    }
  }
}
```

## Trigger Email Extension Configuration

Ensure the extension is configured with:

- **Email documents collection:** `mail`
- **SMTP connection URI:** Your Brevo SMTP URI
- **Default FROM address:** Your verified sender (e.g. info@3rdeyefeel.com or gudimillanaveen@gmail.com)

## Testing

1. Submit a form on your app (use a real email you can check)
2. Check Firestore `requests` - new document should appear
3. Check Firestore `mail` - new document should appear (created by Cloud Function)
4. In a few seconds, `mail` document gets a `delivery` field (added by extension)
5. Check your email inbox (and spam folder)

## Troubleshooting

- **No mail document:** Cloud Function may have failed. Check Firebase Console → Functions → Logs
- **mail document but no email:** Check extension SMTP config and extension logs
- **delivery.error in mail doc:** SMTP/auth issue - verify Brevo credentials
