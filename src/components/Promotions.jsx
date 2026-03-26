import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getActivePromotions } from '../utils/firebaseHelpers'

export default function Promotions() {
  const [promotions, setPromotions] = useState([])

  // Load active promotions from Firebase
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const active = await getActivePromotions()
        setPromotions(active)
      } catch (error) {
        console.error('Error loading promotions:', error)
      }
    }
    loadPromotions()
  }, [])

  if (promotions.length === 0) {
    return null
  }

  return (
    <section className="section">
      <h2 className="section-title">Special Offers</h2>

      <div className="grid grid-2">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="card"
            style={{
              border: `2px solid var(--color-accent)`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-bg)',
                padding: '0.5rem 1rem',
                borderRadius: '0 0 0 8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {promo.discount}
            </div>

            <h4 style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>{promo.title}</h4>
            <p style={{ marginBottom: '1rem' }}>{promo.description}</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>
              Valid until {new Date(promo.validUntil).toLocaleDateString()}
            </p>

            <Link to="/contact" className="btn btn-small">
              Claim Offer
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
