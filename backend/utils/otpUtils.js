import { Resend } from 'resend';
import Otp from '../models/Otp.js';
import crypto from 'crypto';

// Email configuration
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined in environment variables');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@resend.dev';

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
const MAX_OTP_ATTEMPTS = parseInt(process.env.MAX_OTP_ATTEMPTS) || 3;

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash the OTP for secure storage
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// Send OTP via email using Resend API
const sendOTP = async (email, otp, purpose) => {
  const resend = getResendClient();
  
  try {
    const { data, error } = await resend.emails.send({
      from: `Aglo Academy <${FROM_EMAIL}>`,
      to: [email],
      subject: 'Your OTP for Aglo Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2;">Aglo Academy - OTP Verification</h2>
          <p>Hello,</p>
          <p>Your OTP for ${purpose === 'email-verification' ? 'email verification' : 'password reset'} is:</p>
          <div style="background: #f4f4f4; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p style="color: #ff0000; font-size: 12px;">DO NOT share this OTP with anyone. Aglo Academy will never ask for your OTP.</p>
          <p>If you didn't request this, please ignore this email or contact support.</p>
          <p>Best regards,<br/>The Aglo Academy Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email with Resend:', error);
      throw new Error('Failed to send OTP email');
    }
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Create and save OTP record
const createOTPRecord = async (email, purpose) => {
  try {
    // Delete any existing OTPs for this email and purpose
    await Otp.deleteMany({ email, purpose });

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Create new OTP record
    const otpRecord = new Otp({
      email,
      otp: hashedOTP,
      otpExpiry,
      purpose,
    });

    await otpRecord.save();

    return { otp, otpRecord };
  } catch (error) {
    console.error('Error creating OTP record:', error);
    throw new Error('Failed to create OTP record');
  }
};

// Verify OTP
const verifyOTP = async (email, otp, purpose) => {
  try {
    const otpRecord = await Otp.findOne({ 
      email, 
      purpose,
      verified: false,
      otpExpiry: { $gt: new Date() },
      attempts: { $lt: MAX_OTP_ATTEMPTS }
    });

    if (!otpRecord) {
      return { 
        success: false, 
        message: 'Invalid or expired OTP' 
      };
    }

    // Increment attempts
    otpRecord.attempts += 1;
    otpRecord.lastAttempt = new Date();
    await otpRecord.save();

    // Verify OTP
    const hashedOTP = hashOTP(otp);
    if (hashedOTP !== otpRecord.otp) {
      return { 
        success: false, 
        message: 'Invalid OTP',
        attemptsLeft: 3 - otpRecord.attempts
      };
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      message: 'Error verifying OTP' 
    };
  }
};

export { generateOTP, sendOTP, createOTPRecord, verifyOTP, hashOTP };
