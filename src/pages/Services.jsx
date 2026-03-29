import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getServicesContent } from '../utils/firebaseHelpers'

const DEFAULT_SERVICES = [
  {
    id: 'domestic',
    title: 'Domestic Services',
    description: 'Complete electrical solutions for residential properties',
    items: 'New house wiring and rewiring\nLighting installations\nSocket and switch installations\nBoiler and heating control wiring\nBathroom and kitchen electrical work\nGarden lighting and outdoor circuits\nFault finding and repair\nPeriodic testing and safety checks',
  },
  {
    id: 'commercial',
    title: 'Commercial Services',
    description: 'Professional electrical services for business premises',
    items: 'Shop and retail installations\nOffice and warehouse wiring\nEmergency lighting systems\nFire alarm wiring\nData and communications cabling\nIndustrial electrical work\nFault diagnosis and repairs\nMaintenance contracts available',
  },
  {
    id: 'testing',
    title: 'Testing & Inspection',
    description: 'Compliance and safety inspections',
    items: 'Electrical Installation Condition Reports (EICR)\nBuilding Regulation compliance testing\nPat testing for portable appliances\nPeriodic inspection and testing\nSafety certification\nFault analysis reports\nRisk assessment\nRemedial work recommendations',
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    description: 'Ongoing electrical support and preventative maintenance',
    items: 'Planned preventative maintenance\nEmergency call-out service\nRegular safety inspections\nComponent replacement\nSystem upgrades\n24/7 emergency response available\nMaintenance contracts\nTechnical support and advice',
  },
]

const DEFAULT_PAGE = {
  pageTitle: 'Our Electrical Services',
  pageSubtitle: 'Comprehensive electrical services for domestic and commercial customers across Scotland. All work carried out by fully qualified, certified electricians.',
  ctaText: 'Contact us directly and we\'ll be happy to help.',
}

export default function Services() {
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [services, setServices] = useState(DEFAULT_SERVICES)

  useEffect(() => {
    getServicesContent().then(data => {
      if (!data) return
      setPage({ ...DEFAULT_PAGE, ...data })
      if (data.services && Array.isArray(data.services)) {
        setServices(data.services.map((s, i) => ({
          ...DEFAULT_SERVICES[i],
          ...s,
        })))
      }
    })
  }, [])

  const splitLines = (str) => (str || '').split('\n').filter(Boolean)

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1>{page.pageTitle}</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '700px' }}>
          {page.pageSubtitle}
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
                {splitLines(service.items).map((item, idx) => (
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

      {/* Questions CTA */}
      <section className="section" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2 className="section-title">Questions?</h2>
        <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          {page.ctaText}
        </p>
        <Link to="/contact" className="btn">
          Contact Us
        </Link>
      </section>
    </div>
  )
}
