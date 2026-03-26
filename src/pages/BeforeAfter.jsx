export default function BeforeAfter() {
  const projects = [
    {
      id: 1,
      title: 'Complete House Rewiring',
      description: 'Outdated 1970s wiring replaced with modern circuits and safety features.',
      category: 'Domestic',
    },
    {
      id: 2,
      title: 'Kitchen and Bathroom Upgrade',
      description: 'New circuits installed with modern sockets, lighting, and appliance connections.',
      category: 'Domestic',
    },
    {
      id: 3,
      title: 'Shop Refurbishment',
      description: 'Commercial lighting and power installation for retail environment.',
      category: 'Commercial',
    },
  ]

  return (
    <div>
      <h1>Before & After</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
        See the transformation of our completed electrical projects.
      </p>

      <div className="grid grid-2">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <h4>{project.title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-accent)', marginBottom: '1rem' }}>
              {project.category}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-border)',
                  height: '150px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text)',
                  opacity: 0.5,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  padding: '1rem',
                }}
              >
                Before
              </div>
              <div
                style={{
                  backgroundColor: 'var(--color-border)',
                  height: '150px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text)',
                  opacity: 0.5,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  padding: '1rem',
                }}
              >
                After
              </div>
            </div>

            <p>{project.description}</p>
          </div>
        ))}
      </div>

      <section className="section" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          More before and after photos coming soon!
        </p>
        <p style={{ opacity: 0.8 }}>
          We're building our portfolio of transformation photos. Check back soon for more examples.
        </p>
      </section>
    </div>
  )
}
