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
      {/* Keyframe animation injected inline — flashes white twice then pauses */}
      <style>{`
        @keyframes promoFlash {
          0%   { box-shadow: 0 0 0px 0px rgba(255,255,255,0);   background-color: transparent; }
          10%  { box-shadow: 0 0 28px 8px rgba(255,255,255,0.55); background-color: rgba(255,255,255,0.10); }
          20%  { box-shadow: 0 0 0px 0px rgba(255,255,255,0);   background-color: transparent; }
          32%  { box-shadow: 0 0 28px 8px rgba(255,255,255,0.55); background-color: rgba(255,255,255,0.10); }
          44%  { box-shadow: 0 0 0px 0px rgba(255,255,255,0);   background-color: transparent; }
          100% { box-shadow: 0 0 0px 0px rgba(255,255,255,0);   background-color: transparent; }
        }
        .promo-flash {
          animation: promoFlash 4s ease-in-out infinite;
        }
      `}</style>

      <h2 className="section-title">Special Offers</h2>

      <div className="grid grid-2">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="card promo-flash"
            style={{
              border: '2px solid var(--color-accent)',
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
