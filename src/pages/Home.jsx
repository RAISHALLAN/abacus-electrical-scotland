import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Promotions from '../components/Promotions'
import Testimonials from '../components/Testimonials'
import { getHomeContent } from '../utils/firebaseHelpers'

const DEFAULTS = {
  heroTitle: 'Professional Electrical Services',
  heroSubtitle: 'Qualified, certified, and fully insured electrician serving all of Scotland. Domestic and commercial electrical work.',
  qualProfTitle: 'Professional Qualifications',
  qualProfItems: 'City & Guilds Qualified Electrician\nNICEIC Registered\nELECSA Approved\nPEA Member',
  qualSpecTitle: 'Specializations',
  qualSpecItems: 'Domestic Installations\nCommercial Installations\nTesting & Inspection (EICR)\nFault Finding & Repairs',
  servicesTitle: 'Our Services',
  whyTitle: 'Why Choose Us',
  why1Title: '✓ Fully Qualified',
  why1Desc: 'City & Guilds qualified with industry-recognized certifications.',
  why2Title: '✓ Insured & Certified',
  why2Desc: 'NICEIC registered and ELECSA approved for your peace of mind.',
  why3Title: '✓ Free Quotes',
  why3Desc: 'No obligation free quotations for all work undertaken.',
  why4Title: '✓ Fast Response',
  why4Desc: 'Quick turnaround on estimates and prompt job completion.',
  why5Title: '✓ Quality Work',
  why5Desc: 'Professional workmanship with attention to detail.',
  why6Title: '✓ Fair Pricing',
  why6Desc: 'Competitive rates with transparent, itemized quotes.',
  ctaTitle: 'Ready to Get Started?',
  ctaSubtitle: 'Contact us today for a free, no-obligation quote on your electrical work.',
}

export default function Home() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    getHomeContent().then(data => {
      if (data) setContent({ ...DEFAULTS, ...data })
    })
  }, [])

  const splitLines = (str) => (str || '').split('\n').filter(Boolean)

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>{content.heroTitle}</h1>
        <p>{content.heroSubtitle}</p>
        <Link to="/contact" className="btn">
          Get Free Quote
        </Link>
      </section>

      {/* Qualifications Section */}
      <section className="section">
        <h2 className="section-title">Qualifications & Credentials</h2>
        <div className="grid grid-2">
          <div className="card">
            <h3>{content.qualProfTitle}</h3>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              {splitLines(content.qualProfItems).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>{content.qualSpecTitle}</h3>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              {splitLines(content.qualSpecItems).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section">
        <h2 className="section-title">{content.servicesTitle}</h2>
        <div className="grid grid-4">
          <div className="card">
            <h4>Domestic</h4>
            <p>
              Complete electrical services for your home including rewiring, new installations,
              and fault repairs.
            </p>
            <Link to="/services#domestic" className="btn btn-small" style={{ marginTop: 'auto' }}>
              Learn More
            </Link>
          </div>
          <div className="card">
            <h4>Commercial</h4>
            <p>
              Professional electrical services for businesses, shops, offices, and industrial
              premises.
            </p>
            <Link to="/services#commercial" className="btn btn-small" style={{ marginTop: 'auto' }}>
              Learn More
            </Link>
          </div>
          <div className="card">
            <h4>Testing & Inspection</h4>
            <p>
              Electrical Installation Condition Reports (EICR) for safety and compliance with
              Building Regulations.
            </p>
            <Link to="/services#testing" className="btn btn-small" style={{ marginTop: 'auto' }}>
              Learn More
            </Link>
          </div>
          <div className="card">
            <h4>Maintenance</h4>
            <p>
              Regular maintenance and inspection to keep your electrical systems safe and
              compliant.
            </p>
            <Link to="/contact" className="btn btn-small" style={{ marginTop: 'auto' }}>
              Get Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <Promotions />

      {/* Why Choose Us */}
      <section className="section">
        <h2 className="section-title">{content.whyTitle}</h2>
        <div className="grid grid-3">
          {[
            [content.why1Title, content.why1Desc],
            [content.why2Title, content.why2Desc],
            [content.why3Title, content.why3Desc],
            [content.why4Title, content.why4Desc],
            [content.why5Title, content.why5Desc],
            [content.why6Title, content.why6Desc],
          ].map(([title, desc], i) => (
            <div key={i} className="card">
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2 className="section-title">{content.ctaTitle}</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          {content.ctaSubtitle}
        </p>
        <div className="flex flex-center gap-lg" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn">
            Request a Quote
          </Link>
          <Link to="/services" className="btn btn-secondary">
            View Services
          </Link>
        </div>
      </section>
    </div>
  )
}
