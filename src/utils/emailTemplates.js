/**
 * Email template generator for Abacus Electrical Scotland
 * Generates HTML email templates for various notifications
 */

const COMPANY_NAME = 'Abacus Electrical Scotland'
const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectrical.co.uk'
const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE || '(+44) XXX'
const ACCENT_COLOR = '#ff6b35'

// Base HTML template wrapper
const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #000;
        color: white;
        padding: 30px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 30px 20px;
      }
      .footer {
        background-color: #f5f5f5;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #666;
        border-top: 1px solid #ddd;
      }
      .cta-button {
        display: inline-block;
        background-color: ${ACCENT_COLOR};
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 600;
        margin: 15px 0;
      }
      .cta-button:hover {
        opacity: 0.9;
      }
      h2 {
        color: ${ACCENT_COLOR};
        margin-top: 0;
      }
      .info-box {
        background-color: #f9f9f9;
        border-left: 4px solid ${ACCENT_COLOR};
        padding: 15px;
        margin: 15px 0;
        border-radius: 4px;
      }
      .contact-info {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }
      .contact-info p {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>⚡ ${COMPANY_NAME}</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        <p>Phone: ${COMPANY_PHONE} | Email: <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a></p>
      </div>
    </div>
  </body>
</html>
`

/**
 * Contact Form Confirmation Email
 * Sent to customer when they submit the contact form
 */
export const generateContactConfirmationEmail = (customerName, message) => {
  const content = `
    <h2>Thank you for contacting us!</h2>
    <p>Hi ${customerName},</p>
    <p>We've received your message and will get back to you as soon as possible, typically within 24 hours.</p>

    <div class="info-box">
      <strong>Message Summary:</strong>
      <p>${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
    </div>

    <p>If your matter is urgent, please give us a call:</p>
    <p><strong>${COMPANY_PHONE}</strong></p>

    <p>Best regards,<br><strong>${COMPANY_NAME}</strong></p>
  `
  return emailWrapper(content)
}

/**
 * Quote Request Confirmation Email
 * Sent to customer when they submit a quote request
 */
export const generateQuoteConfirmationEmail = (customerName, workType) => {
  const content = `
    <h2>Your quote request has been received!</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for requesting a quote from ${COMPANY_NAME}. We've received your request for:</p>

    <div class="info-box">
      <strong>Service Type:</strong>
      <p>${workType}</p>
    </div>

    <p>Our team will review your request and prepare a detailed quote tailored to your specific needs. We'll send this to you within 2-3 working days.</p>

    <p>If you have any additional information or questions in the meantime, feel free to contact us:</p>
    <p><strong>Phone:</strong> ${COMPANY_PHONE}<br><strong>Email:</strong> ${COMPANY_EMAIL}</p>

    <p>We look forward to working with you!</p>
    <p>Best regards,<br><strong>${COMPANY_NAME}</strong></p>
  `
  return emailWrapper(content)
}

/**
 * Admin Notification - New Quote Request
 * Sent to admin when customer submits a quote request
 */
export const generateAdminQuoteNotificationEmail = (customerName, customerEmail, workType) => {
  const content = `
    <h2>New Quote Request Received</h2>
    <p>A new quote request has been submitted:</p>

    <div class="info-box">
      <strong>Customer Name:</strong> ${customerName}<br>
      <strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a><br>
      <strong>Service Type:</strong> ${workType}
    </div>

    <p>Please log in to your admin dashboard to view the full details and generate a quote.</p>
    <a href="https://abacuselectrical.co.uk/admin" class="cta-button">View Quote Request</a>

    <p>Best regards,<br><strong>Abacus System</strong></p>
  `
  return emailWrapper(content)
}

/**
 * Testimonial Submission Confirmation Email
 * Sent to customer when they submit a testimonial
 */
export const generateTestimonialConfirmationEmail = (customerName) => {
  const content = `
    <h2>Thank you for your testimonial!</h2>
    <p>Hi ${customerName},</p>
    <p>We're grateful for you taking the time to share your feedback. Your testimonial helps us maintain high standards and helps other customers make informed decisions.</p>

    <p>Your feedback will appear on our website shortly after our team reviews it. Thank you for trusting ${COMPANY_NAME}!</p>

    <p>Best regards,<br><strong>${COMPANY_NAME}</strong></p>
  `
  return emailWrapper(content)
}

/**
 * Admin Notification - New Testimonial
 * Sent to admin when customer submits a testimonial
 */
export const generateAdminTestimonialNotificationEmail = (customerName, rating) => {
  const stars = '⭐'.repeat(Math.min(rating, 5))
  const content = `
    <h2>New Testimonial Submitted</h2>
    <p>A new testimonial has been submitted:</p>

    <div class="info-box">
      <strong>From:</strong> ${customerName}<br>
      <strong>Rating:</strong> ${stars} (${rating}/5)
    </div>

    <p>Please log in to your admin dashboard to review and approve the testimonial.</p>
    <a href="https://abacuselectrical.co.uk/admin" class="cta-button">Review Testimonial</a>

    <p>Best regards,<br><strong>Abacus System</strong></p>
  `
  return emailWrapper(content)
}

/**
 * Admin Notification - New Contact Message
 * Sent to admin when customer submits a contact form
 */
export const generateAdminContactNotificationEmail = (customerName, customerEmail, customerPhone, message) => {
  const content = `
    <h2>New Contact Message Received</h2>
    <p>A customer has sent you a message through the website:</p>

    <div class="info-box">
      <strong>From:</strong> ${customerName}<br>
      <strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a><br>
      <strong>Phone:</strong> ${customerPhone || 'Not provided'}
    </div>

    <h3>Message:</h3>
    <div class="info-box">
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>

    <p>Please reply to them at your earliest convenience.</p>

    <p>Best regards,<br><strong>Abacus System</strong></p>
  `
  return emailWrapper(content)
}

/**
 * Generic Quote PDF Email
 * Sent to customer when admin generates and sends a quote
 */
export const generateQuotePDFEmail = (customerName, quoteAmount) => {
  const content = `
    <h2>Your ${COMPANY_NAME} Quote</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for your enquiry. Please find your detailed quote attached below.</p>

    <div class="info-box">
      <strong>Estimated Cost:</strong>
      <p style="font-size: 24px; color: ${ACCENT_COLOR}; font-weight: bold;">£${quoteAmount}</p>
      <p style="font-size: 12px; color: #666;">This quote is valid for 14 days from the date above.</p>
    </div>

    <p>The quote includes:</p>
    <ul>
      <li>Detailed breakdown of materials</li>
      <li>Labour costs</li>
      <li>VAT at the applicable rate</li>
    </ul>

    <p>If you have any questions or would like to proceed, please don't hesitate to contact us:</p>
    <p><strong>Phone:</strong> ${COMPANY_PHONE}<br><strong>Email:</strong> ${COMPANY_EMAIL}</p>

    <p>We look forward to working with you!</p>
    <p>Best regards,<br><strong>${COMPANY_NAME}</strong></p>
  `
  return emailWrapper(content)
}

/**
 * Helper function to send email via Netlify function
 */
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await fetch('/.netlify/functions/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html: htmlContent,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send email')
    }

    return await response.json()
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}
