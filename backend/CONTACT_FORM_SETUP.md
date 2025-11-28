# Contact Form Setup with Resend

This guide will help you set up the contact/inquiry form with Resend email service.

## Prerequisites

1. A Resend account (sign up at https://resend.com)
2. A verified domain in Resend (or use the default `onboarding@resend.dev` for testing)

## Installation

1. Install the Resend package (if not already installed):
```bash
cd backend
npm install resend
```

## Environment Variables

Add the following environment variables to your `.env` file in the `backend` directory:

```env
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Admin email where inquiries will be sent
ADMIN_EMAIL=your-admin@example.com
# OR use CONTACT_EMAIL as alternative
CONTACT_EMAIL=your-admin@example.com

# From email address (must be verified in Resend)
# For testing, you can use: onboarding@resend.dev
# For production, use your verified domain email
FROM_EMAIL=onboarding@resend.dev

# Optional: Send confirmation email to users
# Set to 'true' to enable automatic confirmation emails
SEND_CONFIRMATION_EMAIL=false
```

## Getting Your Resend API Key

1. Go to https://resend.com and sign up/login
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Give it a name (e.g., "Academy Website")
5. Copy the API key and add it to your `.env` file

## Domain Verification (For Production)

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Follow the DNS configuration instructions
4. Once verified, update `FROM_EMAIL` to use your domain (e.g., `noreply@yourdomain.com`)

## Testing

1. Start your backend server:
```bash
cd backend
npm run dev
```

2. Test the contact form by submitting a message from the frontend
3. Check your admin email inbox for the inquiry

## API Endpoint

- **POST** `/api/contact`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Course Inquiry",
    "message": "I'm interested in learning more about..."
  }
  ```

## Features

- ✅ Sends formatted HTML email to admin
- ✅ Includes all form fields in a professional layout
- ✅ Reply-to set to user's email for easy responses
- ✅ Optional confirmation email to users
- ✅ Input validation
- ✅ Error handling

## Troubleshooting

### Emails not sending
- Verify your `RESEND_API_KEY` is correct
- Check that `FROM_EMAIL` is verified in Resend
- Ensure `ADMIN_EMAIL` is a valid email address
- Check server logs for error messages

### Domain verification issues
- Make sure DNS records are correctly configured
- Wait for DNS propagation (can take up to 48 hours)
- Use `onboarding@resend.dev` for testing without domain verification

## Support

For Resend-specific issues, visit: https://resend.com/docs

