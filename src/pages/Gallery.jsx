export default function Gallery() {
  const galleryItems = [
    {
      id: 1,
      title: 'Modern Kitchen Electrical Installation',
      category: 'Domestic',
      description: 'Complete kitchen rewiring with new socket and lighting circuits.',
    },
    {
      id: 2,
      title: 'Commercial Office Lighting',
      category: 'Commercial',
      description: 'Professional office lighting installation with integrated controls.',
    },
    {
      id: 3,
      title: 'Residential Rewiring Project',
      category: 'Domestic',
      description: 'Full house rewiring completed to Building Regulations.',
    },
    {
      id: 4,
      title: 'Industrial Electrical Work',
      category: 'Commercial',
      description: 'Large-scale industrial electrical installation project.',
    },
  ]

  return (
    <div>
      <h1>Gallery</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
        View examples of our completed electrical projects for domestic and commercial clients.
      </p>

      <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
        {galleryItems.map((item) => (
          <div key={item.id} className="card">
            <div
              style={{
                width: '100%',
                height: '200px',
                backgroundColor: 'var(--color-border)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: 'var(--color-text)',
                opacity: 0.5,
              }}
            >
              [Image Placeholder]
            </div>
            <h4>{item.title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
              {item.category}
            </p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <section className="section" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          More images coming soon as we complete new projects.
        </p>
        <p style={{ opacity: 0.8 }}>
          To add your project images, please contact us after we've completed your work.
        </p>
      </section>
    </div>
  )
}
