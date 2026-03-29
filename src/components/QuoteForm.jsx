import { useState, useEffect } from 'react'
import { getWorkTypes, submitQuoteRequest } from '../utils/firebaseHelpers'
import { generateQuoteConfirmationEmail, generateAdminQuoteNotificationEmail, sendEmail } from '../utils/emailTemplates'

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    workType: '',
    workDescription: '',
  })

  const [workTypes, setWorkTypes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load work types from Firebase
  useEffect(() => {
    const loadWorkTypes = async () => {
      try {
        const types = await getWorkTypes()
        setWorkTypes(types)
      } catch (err) {
        console.error('Error loading work types:', err)
        // Fallback to default work types if Firebase fails
        setWorkTypes([
          { name: 'Domestic wiring' },
          { name: 'Commercial installation' },
          { name: 'Testing & Inspection' },
          { name: 'Maintenance' },
        ])
      }
    }
    loadWorkTypes()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const selectedWorkType = formData.workType === 'other' ? formData.workDescription : formData.workType

      // ── Step 1: Save to Firebase (critical — must succeed) ──
      await submitQuoteRequest({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        city: formData.city,
        postcode: formData.postcode,
        workType: selectedWorkType,
        workDescription: formData.workDescription,
      })

      // ── Step 2: Send emails (best-effort — never block the success flow) ──
      // Emails rely on a Netlify serverless function which is only available
      // on the live site. Failures here are logged but do not affect the user.
      try {
        const customerEmailHtml = generateQuoteConfirmationEmail(formData.name, selectedWorkType)
        await sendEmail(
          formData.email,
          'Quote Request Received - Abacus Electrical Scotland',
          customerEmailHtml
        )
      } catch (emailErr) {
        console.warn('Customer confirmation email could not be sent:', emailErr.message)
      }

      try {
        const adminEmail = import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectrical.co.uk'
        const adminEmailHtml = generateAdminQuoteNotificationEmail(formData.name, formData.email, selectedWorkType)
        await sendEmail(
          adminEmail,
          'New Quote Request - Abacus Electrical',
          adminEmailHtml
        )
      } catch (emailErr) {
        console.warn('Admin notification email could not be sent:', emailErr.message)
      }

      // ── Step 3: Show success ──
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postcode: '',
        workType: '',
        workDescription: '',
      })

      setTimeout(() => setSubmitted(false), 60000)
    } catch (error) {
      // Only reached if the Firebase save itself failed
      console.error('Error saving quote request:', error)
      setError('Error submitting form. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="card" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4CAF50' }}>
        <h3 style={{ color: '#4CAF50', marginBottom: '1rem' }}>✓ Quote Request Received</h3>
        <p>
          Thank you for your quote request! We've received your information and will send you a free
          quotation within 24 hours.
        </p>
        <p style={{ marginTop: '1rem', opacity: 0.8 }}>
          Please check your email ({formData.email}) for our response.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      {error && <p style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>⚠ {error}</p>}
      <div className="grid grid-2">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(+44) XXXX XXXXX"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address/Location *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City/Town *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City or town"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="postcode">Postcode *</label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="Postcode"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="workType">Type of Work *</label>
        <select
          id="workType"
          name="workType"
          value={formData.workType}
          onChange={handleChange}
          required
        >
          <option value="">-- Select work type --</option>
          {workTypes.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name}
            </option>
          ))}
          <option value="other">Other (please describe below)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="workDescription">Describe Your Work *</label>
        <textarea
          id="workDescription"
          name="workDescription"
          value={formData.workDescription}
          onChange={handleChange}
          placeholder="Tell us about the electrical work you need..."
          required
        />
      </div>

      <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Sending...' : 'Request Free Quote'}
      </button>
    </form>
  )
}
