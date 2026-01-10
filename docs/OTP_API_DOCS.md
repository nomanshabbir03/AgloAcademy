# OTP Verification API Documentation

This document outlines the API endpoints for handling OTP-based email verification and password reset functionality.

## Table of Contents
1. [Send OTP for Email Verification](#send-otp-for-email-verification)
2. [Verify Email with OTP](#verify-email-with-otp)
3. [Register with Verified Email](#register-with-verified-email)
4. [Forgot Password (Send OTP)](#forgot-password-send-otp)
5. [Reset Password with OTP](#reset-password-with-otp)

---

## Send OTP for Email Verification

Sends a 6-digit OTP to the provided email address for email verification during registration.

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "message": "OTP sent successfully",
  "otpId": "60d21b4667d0d8992e610c85",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400 Bad Request`: Email is required
- `409 Conflict`: User already exists with this email
- `500 Internal Server Error`: Failed to send OTP

---

## Verify Email with OTP

Verifies the OTP sent to the user's email address.

**Endpoint:** `POST /api/auth/verify-email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Email and OTP are required
- `400 Bad Request`: Invalid or expired OTP
- `500 Internal Server Error`: Error verifying email

---

## Register with Verified Email

Registers a new user after email verification.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

**Success Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student",
    "isEmailVerified": true,
    "enrolledCourses": []
  }
}
```

**Error Responses:**
- `400 Bad Request`: Name, email, and password are required
- `400 Bad Request`: Email not verified. Please verify your email first.
- `409 Conflict`: User already exists with this email
- `500 Internal Server Error`: Server error during registration

---

## Forgot Password (Send OTP)

Sends a password reset OTP to the provided email address.

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "message": "If an account exists with this email, a password reset OTP has been sent",
  "otpId": "60d21b4667d0d8992e610c85",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400 Bad Request`: Email is required
- `500 Internal Server Error`: Error processing forgot password request

---

## Reset Password with OTP

Resets the user's password after OTP verification.

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Error Responses:**
- `400 Bad Request`: Email, OTP, and new password are required
- `400 Bad Request`: Password must be at least 6 characters long
- `400 Bad Request`: Invalid or expired OTP
- `404 Not Found`: User not found
- `500 Internal Server Error`: Error resetting password

---

## Notes

1. **OTP Expiry**: OTPs are valid for 10 minutes by default (configurable via `OTP_EXPIRY_MINUTES` in .env)
2. **Maximum Attempts**: Users have 3 attempts to enter the correct OTP (configurable via `MAX_OTP_ATTEMPTS` in .env)
3. **Email Configuration**: Ensure proper email service configuration in the `.env` file
4. **Security**: Always use HTTPS in production to protect OTPs in transit
5. **Rate Limiting**: Consider implementing rate limiting on the OTP endpoints to prevent abuse

## Environment Variables

Make sure to set these environment variables in your `.env` file:

```
# Email configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# OTP configuration
OTP_EXPIRY_MINUTES=10
MAX_OTP_ATTEMPTS=3
```

For Gmail, you'll need to generate an App Password if you have 2FA enabled:
1. Go to your Google Account settings
2. Navigate to Security > App Passwords
3. Generate a new app password for your application
