import { Resend } from 'resend';

// Initialize Resend only if API key is available
let resend = null;
const getResend = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured. Please add it to your .env file.');
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

/**
 * @desc    Send inquiry/contact form email
 * @route   POST /api/contact
 * @access  Public
 */
export const sendInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Get admin email from environment or use default
    const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || 'tgdplanet@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

    // Get Resend instance
    const resendInstance = getResend();

    // Send email to admin
    const { data, error } = await resendInstance.emails.send({
      from: `TGD Planet <${fromEmail}>`,
      to: [adminEmail],
      replyTo: email,
      subject: `New Inquiry: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 5px;
                display: block;
              }
              .value {
                color: #4b5563;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border-left: 3px solid #3b82f6;
              }
              .message-box {
                min-height: 100px;
                white-space: pre-wrap;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>New Contact Form Inquiry</h1>
              <p>You have received a new message from your website</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">
                  <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                </div>
              </div>
              
              <div class="field">
                <span class="label">Subject:</span>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <span class="label">Message:</span>
                <div class="value message-box">${message}</div>
              </div>
              
              <div class="footer">
                <p>This email was sent from the Aglo Academy contact form.</p>
                <p>You can reply directly to this email to respond to ${name}.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Inquiry

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the TGD Planet contact form.
You can reply directly to this email to respond to ${name}.
      `
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again later.'
      });
    }

    // Optionally send confirmation email to the user
    if (process.env.SEND_CONFIRMATION_EMAIL === 'true') {
      await resendInstance.emails.send({
        from: `Aglo Academy <${fromEmail}>`,
        to: [email],
        subject: 'Thank you for contacting TGD Planet',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 8px 8px;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  text-align: center;
                  color: #6b7280;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Thank You for Contacting Us!</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to TGD Planet. We have received your inquiry regarding:</p>
                <p><strong>${subject}</strong></p>
                <p>Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.</p>
                <p>If you have any urgent questions, please feel free to contact us directly.</p>
                <div class="footer">
                  <p>Best regards,<br>The TGD Planet Team</p>
                </div>
              </div>
            </body>
          </html>
        `
      });
    }

    res.status(200).json({
      success: true,
      message: 'Your inquiry has been sent successfully. We will get back to you soon!',
      data: {
        id: data?.id
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending your inquiry. Please try again later.'
    });
  }
};

