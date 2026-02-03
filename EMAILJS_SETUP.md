# EmailJS Welcome Email Setup Guide

This guide will help you set up automatic welcome emails that are sent to users when they submit forms.

## Why EmailJS?

- **Free Tier**: 200 emails/month (perfect for most startups)
- **Easy Setup**: No backend required, works entirely client-side
- **No Cost**: Free tier sufficient for moderate traffic
- **Simple Integration**: Just add a service and API keys

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. Log in to your EmailJS dashboard
2. Go to "Email Services" in the sidebar
3. Click "Add New Service"
4. Choose one of these options:
   - **Gmail** (recommended for easy setup)
   - **Outlook** 
   - **Custom SMTP** (more control, requires SMTP credentials)

### For Gmail (Recommended):

1. Select "Gmail" from the service list
2. Click "Connect Account"
3. Sign in with your Gmail account
4. Grant permissions to EmailJS
5. Note your **Service ID** (e.g., `service_xxxxx`)

### For Outlook:

1. Select "Outlook" from the service list
2. Click "Connect Account"
3. Sign in with your Outlook/Microsoft account
4. Grant permissions
5. Note your **Service ID**

### For Custom SMTP:

1. Select "Custom SMTP"
2. Enter your SMTP server details:
   - SMTP Host
   - SMTP Port (usually 587)
   - SMTP Username
   - SMTP Password
   - From Name and Email
3. Test connection
4. Note your **Service ID**

## Step 3: Create Email Template

1. Go to "Email Templates" in the sidebar
2. Click "Create New Template"
3. Fill in the template details:

**Subject:**
```
Welcome to 3rd Eye Feel - Thank You for Your Request!
```

**Content (HTML):**
```html
<h2>Hi {{user_name}},</h2>

<p>Thank you for contacting <strong>3rd Eye Feel</strong>!</p>

<p>We've received your request for <strong>{{service_type}}</strong> and our team will review it shortly. We typically respond within 24 hours.</p>

<h3>Request Summary:</h3>
<ul>
  <li><strong>Service:</strong> {{service_type}}</li>
  <li><strong>Submitted:</strong> {{submission_date}}</li>
  <li><strong>Budget Range:</strong> {{budget_range}}</li>
  <li><strong>Timeline:</strong> {{timeline}}</li>
</ul>

<h3>What happens next?</h3>
<p>Our team will review your requirements and get back to you within 24 hours with next steps and a personalized proposal.</p>

<p>If you have any questions, feel free to reach out to us.</p>

<p>Best regards,<br>
The 3rd Eye Feel Team</p>

<hr>
<p><small>3rd Eye Feel<br>
Advanced AI Solutions & Production Services</small></p>
```

**Available Template Variables:**
- `{{user_name}}` - User's full name
- `{{user_email}}` - User's email address
- `{{service_type}}` - Selected service name
- `{{submission_date}}` - Date and time of submission
- `{{budget_range}}` - Selected budget range
- `{{timeline}}` - Selected timeline
- `{{message}}` - User's message/notes

4. Click "Save"
5. Note your **Template ID** (e.g., `template_xxxxx`)

## Step 4: Get Your Public Key

1. Go to "Account" in the sidebar (or "General" tab)
2. Find "Public Key" section
3. Copy your **Public Key** (e.g., `xxxxxxxxxxxxxxx`)

## Step 5: Add Environment Variables

1. Open your `.env` file in the project root (create it if it doesn't exist)
2. Add these variables:

```env
# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Example:**
```env
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=abcdefghijklmnop
```

3. **Important**: Restart your development server after updating `.env`

## Step 6: Verify Installation

The EmailJS package (`@emailjs/browser`) is already installed. Verify by checking `package.json`:

```bash
npm list @emailjs/browser
```

## Step 7: Test Email Sending

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to your app and submit a test form

3. Check the browser console for:
   - "Welcome email sent successfully to: [email]"
   - Any error messages

4. Check the email inbox for the test email

5. Check spam folder if email doesn't arrive

## How It Works

1. User submits form
2. Form data is saved to Firestore
3. `sendWelcomeEmail()` is called automatically
4. EmailJS sends email to user's email address
5. User receives welcome email with request details

## Troubleshooting

### Email not sending

**Check:**
- Environment variables are set correctly in `.env`
- Service ID, Template ID, and Public Key are correct
- Development server was restarted after adding `.env` variables
- Email service is connected properly in EmailJS dashboard
- Check browser console for error messages

### "EmailJS not configured" warning

- Make sure all three environment variables are set:
  - `REACT_APP_EMAILJS_SERVICE_ID`
  - `REACT_APP_EMAILJS_TEMPLATE_ID`
  - `REACT_APP_EMAILJS_PUBLIC_KEY`
- Restart your development server

### Email going to spam

- Check spam folder first
- Verify sender email address is correct
- Consider using a verified domain email address
- Add sender email to email service's whitelist

### "Invalid email address" warning

- Email format is validated before sending
- Check that form email field is valid
- Verify email address format

### Rate limiting (200 emails/month)

- Free tier allows 200 emails/month
- Check EmailJS dashboard for usage
- Consider upgrading if you need more
- Emails will fail silently if limit exceeded

## Production Deployment

When deploying to production (Firebase Hosting, Vercel, etc.):

1. Add the same environment variables to your hosting platform:
   - Firebase Hosting: Use Firebase Functions config or `.env` in build
   - Vercel: Add in "Settings > Environment Variables"
   - Netlify: Add in "Site settings > Environment variables"

2. Rebuild and redeploy your application

3. Test email sending in production

## Free Tier Limitations

- **200 emails/month** - Perfect for startups and small businesses
- If you need more, upgrade to paid plans:
  - Plus: $15/month for 1,000 emails
  - Pro: $40/month for 10,000 emails
  - Business: Custom pricing

## Next Steps

- Customize email template with your branding
- Add company logo to email
- Set up multiple email templates for different services
- Add email analytics (requires paid plan)
- Set up admin notifications when forms are submitted

## Support

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/support/)
- Check browser console for specific error messages
