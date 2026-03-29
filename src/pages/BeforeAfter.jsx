import { useState, useEffect } from 'react'
import { getBeforeAfterPairs } from '../utils/firebaseHelpers'

export default function BeforeAfter() {
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null) // { url, title, label }

  useEffect(() => {
    getBeforeAfterPairs().then(data => {
      setPairs(data)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1>Before &amp; After</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
        See the transformation of our completed electrical projects. Click any image to enlarge.
      </p>

      {loading ? (
        <p>Loading projects...</p>
      ) : pairs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ opacity: 0.7 }}>Before &amp; after photos coming soon — check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {pairs.map(pair => (
            <div key={pair.id} className="card" style={{ padding: '0.75rem' }}>
              <h4 style={{ marginBottom: '0.2rem', fontSize: '0.95rem' }}>{pair.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', marginBottom: '0.6rem' }}>{pair.category}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '0.75rem' }}>
                {/* Before */}
                <div>
                  <p style={{
                    fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.4rem',
                    textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: '#f87171',
                  }}>Before</p>
                  <div
                    onClick={() => setLightbox({ url: pair.beforeUrl, title: pair.title, label: 'Before' })}
                    style={{ position: 'relative', cursor: 'zoom-in', borderRadius: '4px', overflow: 'hidden' }}
                  >
                    <img
                      src={pair.beforeUrl}
                      alt={`${pair.title} before`}
                      style={{ width: '100%', height: 'auto', maxHeight: '180px', objectFit: 'contain', display: 'block', background: '#111' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0)',
                      transition: 'background-color 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'}
                    />
                  </div>
                </div>

                {/* After */}
                <div>
                  <p style={{
                    fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.4rem',
                    textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: '#4ade80',
                  }}>After</p>
                  <div
                    onClick={() => setLightbox({ url: pair.afterUrl, title: pair.title, label: 'After' })}
                    style={{ position: 'relative', cursor: 'zoom-in', borderRadius: '4px', overflow: 'hidden' }}
                  >
                    <img
                      src={pair.afterUrl}
                      alt={`${pair.title} after`}
                      style={{ width: '100%', height: 'auto', maxHeight: '180px', objectFit: 'contain', display: 'block', background: '#111' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0)',
                      transition: 'background-color 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'}
                    />
                  </div>
                </div>
              </div>

              {pair.description && (
                <p style={{ fontSize: '0.82rem', opacity: 0.8, margin: 0 }}>{pair.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: '1rem', cursor: 'pointer',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%', cursor: 'default' }}>
            <img
              src={lightbox.url}
              alt={lightbox.title}
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '6px', display: 'block' }}
            />
            <div style={{ marginTop: '0.75rem', textAlign: 'center', color: '#fff' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.85 }}>
                <strong>{lightbox.title}</strong> — {lightbox.label}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', top: '1.25rem', right: '1.25rem',
              background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
              fontSize: '1.4rem', width: '38px', height: '38px', borderRadius: '50%',
              cursor: 'pointer', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>
      )}
    </div>
  )
}
