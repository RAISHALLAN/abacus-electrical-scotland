import { Link } from 'react-router-dom'

export default function Services() {
  const services = [
    {
      id: 'domestic',
      title: 'Domestic Services',
      description: 'Complete electrical solutions for residential properties',
      items: [
        'New house wiring and rewiring',
        'Lighting installations',
        'Socket and switch installations',
        'Boiler and heating control wiring',
        'Bathroom and kitchen electrical work',
        'Garden lighting and outdoor circuits',
        'Fault finding and repair',
        'Periodic testing and safety checks',
      ],
    },
    {
      id: 'commercial',
      title: 'Commercial Services',
      description: 'Professional electrical services for business premises',
      items: [
        'Shop and retail installations',
        'Office and warehouse wiring',
        'Emergency lighting systems',
        'Fire alarm wiring',
        'Data and communications cabling',
        'Industrial electrical work',
        'Fault diagnosis and repairs',
        'Maintenance contracts available',
      ],
    },
    {
      id: 'testing',
      title: 'Testing & Inspection',
      description: 'Compliance and safety inspections',
      items: [
        'Electrical Installation Condition Reports (EICR)',
        'Building Regulation compliance testing',
        'Pat testing for portable appliances',
        'Periodic inspection and testing',
        'Safety certification',
        'Fault analysis reports',
        'Risk assessment',
        'Remedial work recommendations',
      ],
    },
    {
      id: 'maintenance',
      title: 'Maintenance & Support',
      description: 'Ongoing electrical support and preventative maintenance',
      items: [
        'Planned preventative maintenance',
        'Emergency call-out service',
        'Regular safety inspections',
        'Component replacement',
        'System upgrades',
        '24/7 emergency response available',
        'Maintenance contracts',
        'Technical support and advice',
      ],
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1>Our Electrical Services</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '700px' }}>
          Comprehensive electrical services for domestic and commercial customers across Scotland.
          All work carried out by fully qualified, certified electricians.
        </p>
      </div>

      {services.map((service) => (
        <section key={service.id} className="section" id={service.id}>
          <h2 className="section-title">{service.title}</h2>
          <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem', opacity: 0.9 }}>
            {service.description}
          </p>

          <div className="grid grid-2">
            <div>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'none' }}>
                {service.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--color-accent)' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h4>Service Details</h4>
              <p>
                All our {service.title.toLowerCase()} work is carried out by qualified electricians
                who are registered with NICEIC and approved by ELECSA.
              </p>
              <p>
                We pride ourselves on quality workmanship, transparent pricing, and excellent customer
                service.
              </p>
              <p style={{ marginTop: '1rem', fontWeight: 500 }}>
                Need this service? Contact us for a free quote.
              </p>
              <Link to="/contact" className="btn" style={{ marginTop: '1rem' }}>
                Get Free Quote
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* FAQ CTA */}
      <section className="section" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2 className="section-title">Questions?</h2>
        <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          Check out our FAQ section or contact us directly.
        </p>
        <Link to="/contact" className="btn">
          Contact Us
        </Link>
      </section>
    </div>
  )
}
