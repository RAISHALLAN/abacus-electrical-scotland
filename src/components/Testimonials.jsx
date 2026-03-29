import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApprovedTestimonials, submitTestimonial } from '../utils/firebaseHelpers'
import { generateTestimonialConfirmationEmail, generateAdminTestimonialNotificationEmail, sendEmail } from '../utils/emailTemplates'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    text: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')

  // Load testimonials from Firebase
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const approved = await getApprovedTestimonials()
        setTestimonials(approved)
      } catch (error) {
        console.error('Error loading testimonials:', error)
      }
    }
    loadTestimonials()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    setSubmitMessage('')

    try {
      // ── Step 1: Save to Firebase (critical — must succeed) ──
      await submitTestimonial({
        name: formData.name,
        email: formData.email,
        rating: parseInt(formData.rating),
        text: formData.text,
      })

      // ── Step 2: Send emails (best-effort — never block the success flow) ──
      try {
        const customerEmailHtml = generateTestimonialConfirmationEmail(formData.name)
        await sendEmail(
          formData.email,
          'Testimonial Received - Abacus Electrical Scotland',
          customerEmailHtml
        )
      } catch (emailErr) {
        console.warn('Customer testimonial confirmation email could not be sent:', emailErr.message)
      }

      try {
        const adminEmail = import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectrical.co.uk'
        const adminEmailHtml = generateAdminTestimonialNotificationEmail(formData.name, formData.rating)
        await sendEmail(
          adminEmail,
          'New Testimonial Submitted - Abacus Electrical',
          adminEmailHtml
        )
      } catch (emailErr) {
        console.warn('Admin testimonial notification email could not be sent:', emailErr.message)
      }

      // ── Step 3: Show success ──
      setFormData({ name: '', email: '', rating: 5, text: '' })
      setShowForm(false)
      setSubmitMessage('Thank you! Your testimonial has been submitted for approval. A confirmation email has been sent to you.')

      setTimeout(() => setSubmitMessage(''), 60000)
    } catch (error) {
      // Only reached if the Firebase save itself failed
      console.error('Error submitting testimonial:', error)
      setSubmitError('Error submitting testimonial. Please try again or contact us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < rating ? 'var(--color-accent)' : 'var(--color-border)' }}>
        ★
      </span>
    ))
  }

  return (
    <section className="section">
      <h2 className="section-title">Client Testimonials</h2>

      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="card">
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {renderStars(testimonial.rating)}
              </div>
              <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{testimonial.name}</p>
            </div>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', opacity: 0.9 }}>
              "{testimonial.text}"
            </p>
            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
              {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : ''}
            </p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        {submitMessage && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 2rem',
            padding: '1rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderLeft: '4px solid #4CAF50',
            color: '#4CAF50'
          }}>
            {submitMessage}
          </div>
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-secondary"
          style={{ marginBottom: '2rem' }}
        >
          {showForm ? 'Cancel' : 'Leave a Testimonial'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {submitError && <p style={{ color: '#F44336', marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(244, 67, 54, 0.1)', borderRadius: '4px' }}>⚠ {submitError}</p>}
            <div className="form-group">
              <label htmlFor="test-name">Your Name *</label>
              <input
                type="text"
                id="test-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="test-email">Email Address *</label>
              <input
                type="email"
                id="test-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="test-rating">Rating *</label>
              <select
                id="test-rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Good</option>
                <option value="3">3 Stars - Average</option>
                <option value="2">2 Stars - Poor</option>
                <option value="1">1 Star - Very Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="test-text">Your Testimonial *</label>
              <textarea
                id="test-text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Testimonial'}
            </button>
            <p style={{ fontSize: '0.85rem', marginTop: '1rem', opacity: 0.7 }}>
              Your testimonial will be reviewed and approved before appearing on our website.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
