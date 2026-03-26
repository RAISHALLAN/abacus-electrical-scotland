import { Link } from 'react-router-dom'
import Promotions from '../components/Promotions'
import Testimonials from '../components/Testimonials'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Professional Electrical Services</h1>
        <p>
          Qualified, certified, and fully insured electrician serving all of Scotland.
          Domestic and commercial electrical work.
        </p>
        <Link to="/contact" className="btn">
          Get Free Quote
        </Link>
      </section>

      {/* Qualifications Section */}
      <section className="section">
        <h2 className="section-title">Qualifications & Credentials</h2>
        <div className="grid grid-2">
          <div className="card">
            <h3>Professional Qualifications</h3>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>City & Guilds Qualified Electrician</li>
              <li>NICEIC Registered</li>
              <li>ELECSA Approved</li>
              <li>PEA Member</li>
            </ul>
          </div>
          <div className="card">
            <h3>Specializations</h3>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Domestic Installations</li>
              <li>Commercial Installations</li>
              <li>Testing & Inspection (EICR)</li>
              <li>Fault Finding & Repairs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section">
        <h2 className="section-title">Our Services</h2>
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
        <h2 className="section-title">Why Choose Us</h2>
        <div className="grid grid-3">
          <div className="card">
            <h4>✓ Fully Qualified</h4>
            <p>City & Guilds qualified with industry-recognized certifications.</p>
          </div>
          <div className="card">
            <h4>✓ Insured & Certified</h4>
            <p>NICEIC registered and ELECSA approved for your peace of mind.</p>
          </div>
          <div className="card">
            <h4>✓ Free Quotes</h4>
            <p>No obligation free quotations for all work undertaken.</p>
          </div>
          <div className="card">
            <h4>✓ Fast Response</h4>
            <p>Quick turnaround on estimates and prompt job completion.</p>
          </div>
          <div className="card">
            <h4>✓ Quality Work</h4>
            <p>Professional workmanship with attention to detail.</p>
          </div>
          <div className="card">
            <h4>✓ Fair Pricing</h4>
            <p>Competitive rates with transparent, itemized quotes.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2 className="section-title">Ready to Get Started?</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Contact us today for a free, no-obligation quote on your electrical work.
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
