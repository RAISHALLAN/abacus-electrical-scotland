import { useState, useEffect } from 'react'
import QuoteForm from '../components/QuoteForm'
import { generateContactConfirmationEmail, generateAdminContactNotificationEmail, sendEmail } from '../utils/emailTemplates'
import { getContactInfo } from '../utils/firebaseHelpers'

export default function Contact() {
  const [activeTab, setActiveTab] = useState('quote')
  const [companyInfo, setCompanyInfo] = useState({
    phone: import.meta.env.VITE_COMPANY_PHONE || '+44 7931768138',
    email: import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectricalscotland.co.uk',
    address: import.meta.env.VITE_COMPANY_ADDRESS || 'Scotland',
  })

  useEffect(() => {
    getContactInfo().then(data => {
      if (data) setCompanyInfo(prev => ({ ...prev, ...data }))
    })
  }, [])

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
      // ── Emails are best-effort — failures are logged but never shown to the user ──
      try {
        const customerEmailHtml = generateContactConfirmationEmail(contactInfo.name, contactInfo.message)
        await sendEmail(
          contactInfo.email,
          'Message received - Abacus Electrical Scotland',
          customerEmailHtml
        )
      } catch (emailErr) {
        console.warn('Customer contact confirmation email could not be sent:', emailErr.message)
      }

      try {
        const adminEmail = companyInfo.email
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
      } catch (emailErr) {
        console.warn('Admin contact notification email could not be sent:', emailErr.message)
      }

      setSubmitMessage({
        type: 'success',
        text: 'Thank you! We\'ve received your message and will get back to you soon. A confirmation email has been sent to ' + contactInfo.email
      })

      setContactInfo({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitMessage(null), 60000)
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

  const tabStyle = (tab) => ({
    padding: '0.65rem 1.5rem',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid var(--color-accent)' : '3px solid transparent',
    background: 'none',
    color: activeTab === tab ? 'var(--color-accent)' : 'var(--color-text)',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    fontSize: '1rem',
    cursor: 'pointer',
    opacity: activeTab === tab ? 1 : 0.65,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  })

  return (
    <div>
      <h1>Contact Us</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
        Get in touch with us. We're happy to discuss your electrical needs and provide a free quote.
      </p>

      {/* ── Tabbed Forms ── */}
      <div style={{ marginBottom: '3rem' }}>

        {/* Tab bar */}
        <style>{`
          @keyframes tabGlow {
            0%, 100% { box-shadow: 0 0 6px 2px rgba(37,99,235,0.4), 0 0 12px 4px rgba(99,179,237,0.2); border-color: rgba(37,99,235,0.5); color: inherit; }
            50%       { box-shadow: 0 0 22px 8px rgba(37,99,235,0.95), 0 0 40px 14px rgba(99,179,237,0.5); border-color: rgba(37,99,235,1);   color: #93c5fd; }
          }
          .tab-glow {
            animation: tabGlow 1.6s ease-in-out infinite;
          }
        `}</style>

        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
          gap: '0.5rem',
          alignItems: 'flex-end',
        }}>
          {/* Quote tab — left, glows when inactive */}
          <button
            className={activeTab !== 'quote' ? 'tab-glow' : ''}
            style={{
              ...tabStyle('quote'),
              borderRadius: '6px 6px 0 0',
              border: activeTab !== 'quote' ? '1px solid rgba(37,99,235,0.4)' : '1px solid transparent',
              borderBottom: activeTab === 'quote' ? '3px solid var(--color-accent)' : '1px solid transparent',
              padding: '0.6rem 1.4rem',
            }}
            onClick={() => setActiveTab('quote')}
          >
            📋 Request a Free Quote
          </button>
          {/* Message tab — right, glows when inactive to attract attention */}
          <button
            className={activeTab !== 'message' ? 'tab-glow' : ''}
            style={{
              ...tabStyle('message'),
              borderRadius: '6px 6px 0 0',
              border: activeTab !== 'message' ? '1px solid rgba(37,99,235,0.4)' : '1px solid transparent',
              borderBottom: activeTab === 'message' ? '3px solid var(--color-accent)' : '1px solid transparent',
              padding: '0.6rem 1.4rem',
            }}
            onClick={() => setActiveTab('message')}
          >
            ✉ Send a Message
          </button>
        </div>

        {/* Send a Message tab */}
        {activeTab === 'message' && (
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
        )}

        {/* Request a Free Quote tab */}
        {activeTab === 'quote' && (
          <div>
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
              Fill out the form below to request a free, no-obligation quote for your electrical work.
            </p>
            <QuoteForm />
          </div>
        )}
      </div>

      {/* ── Get In Touch Details ── */}
      <section className="section">
        <h2 className="section-title">Get In Touch</h2>
        <div className="grid grid-2">
          <div className="card">
            <h4>Phone</h4>
            <p>
              <a href={`tel:${companyInfo.phone}`}>
                {companyInfo.phone}
              </a>
            </p>
          </div>

          <div className="card">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${companyInfo.email}`}>
                {companyInfo.email}
              </a>
            </p>
          </div>

          <div className="card">
            <h4>Address</h4>
            <p>{companyInfo.address}</p>
          </div>

          <div className="card">
            <h4>Service Area</h4>
            <p>We provide electrical services throughout Scotland.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
