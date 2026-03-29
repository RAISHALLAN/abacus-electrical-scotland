import { useState, useEffect } from 'react'
import { getGalleryImages } from '../utils/firebaseHelpers'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null) // { url, title, description }

  useEffect(() => {
    getGalleryImages().then(data => {
      setImages(data)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1>Gallery</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
        View examples of our completed electrical projects for domestic and commercial clients.
      </p>

      {loading ? (
        <p>Loading gallery...</p>
      ) : images.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ opacity: 0.7 }}>Gallery images coming soon — check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
          {images.map(img => (
            <div
              key={img.id}
              className="card"
              style={{ cursor: 'pointer', padding: '0', overflow: 'hidden' }}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '1rem' }}>
                <h4 style={{ marginBottom: '0.3rem' }}>{img.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-accent)', marginBottom: '0.4rem' }}>{img.category}</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: '1rem',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%' }}>
            <img
              src={lightbox.imageUrl}
              alt={lightbox.title}
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '6px' }}
            />
            <div style={{ marginTop: '1rem', textAlign: 'center', color: '#fff' }}>
              <h3 style={{ margin: '0 0 0.3rem' }}>{lightbox.title}</h3>
              <p style={{ opacity: 0.75, margin: 0 }}>{lightbox.description}</p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                fontSize: '1.5rem', width: '40px', height: '40px', borderRadius: '50%',
                cursor: 'pointer', lineHeight: 1,
              }}
            >×</button>
          </div>
        </div>
      )}
    </div>
  )
}
