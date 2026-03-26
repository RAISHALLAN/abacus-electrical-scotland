import { useState } from 'react'
import QuoteForm from '../components/QuoteForm'
import { generateContactConfirmationEmail, generateAdminContactNotificationEmail, sendEmail } from '../utils/emailTemplates'

export default function Contact() {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState(null)

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactInfo(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage(null)

    try {
      // Generate email template for customer
      const customerEmailHtml = generateContactConfirmationEmail(contactInfo.name, contactInfo.message)

      // Send confirmation email to customer
      await sendEmail(
        contactInfo.email,
        'Message received - Abacus Electrical Scotland',
        customerEmailHtml
      )

      // Send admin notification to Graeme
      const adminEmail = import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectrical.co.uk'
      const adminEmailHtml = generateAdminContactNotificationEmail(
        contactInfo.name,
        contactInfo.email,
        '',
        contactInfo.message
      )
      await sendEmail(
        adminEmail,
        'New Contact Message - Abacus Electrical',
        adminEmailHtml
      )

      // Show success message
      setSubmitMessage({
        type: 'success',
        text: 'Thank you! We\'ve received your message and will get back to you soon. A confirmation email has been sent to ' + contactInfo.email
      })

      // Clear form
      setContactInfo({ name: '', email: '', message: '' })

      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(null), 5000)
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitMessage({
        type: 'error',
        text: 'We couldn\'t send your message. Please try again or call us directly at ' + (import.meta.env.VITE_COMPANY_PHONE || '(+44) XXX')
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Contact Us</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
        Get in touch with us. We're happy to discuss your electrical needs and provide a free quote.
      </p>

      <div className="grid grid-2" style={{ marginBottom: '3rem', gap: '2rem' }}>
        {/* Contact Information */}
        <div>
          <h2 className="section-title">Get In Touch</h2>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h4>Phone</h4>
            <p>
              <a href={`tel:${import.meta.env.VITE_COMPANY_PHONE || '+440000000000'}`}>
                {import.meta.env.VITE_COMPANY_PHONE || '(+44) XXX'}
              </a>
            </p>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h4>Email</h4>
            <p>
              <a href={`mailto:${import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectrical.co.uk'}`}>
                {import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectrical.co.uk'}
              </a>
            </p>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h4>Address</h4>
            <p>{import.meta.env.VITE_COMPANY_ADDRESS || 'Scotland'}</p>
          </div>

          <div className="card">
            <h4>Service Area</h4>
            <p>We provide electrical services throughout Scotland.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="section-title">Send a Message</h2>
          <form onSubmit={handleContactSubmit} className="card">
            {submitMessage && (
              <div style={{
                padding: '1rem',
                marginBottom: '1.5rem',
                borderRadius: '4px',
                backgroundColor: submitMessage.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                borderLeft: `4px solid ${submitMessage.type === 'success' ? '#4CAF50' : '#F44336'}`,
                color: submitMessage.type === 'success' ? '#4CAF50' : '#F44336'
              }}>
                {submitMessage.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactInfo.name}
                onChange={handleContactChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactInfo.email}
                onChange={handleContactChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={contactInfo.message}
                onChange={handleContactChange}
                required
                disabled={submitting}
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Quote Request Section */}
      <section className="section">
        <h2 className="section-title">Request a Free Quote</h2>
        <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
          Fill out the form below to request a free, no-obligation quote for your electrical work.
        </p>
        <QuoteForm />
      </section>
    </div>
  )
}
