import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../utils/firebase'
import { ref, get, set } from 'firebase/database'

export default function Layout({ children }) {
  const location = useLocation()
  const [bannerDesign, setBannerDesign] = useState('design-wires')

  useEffect(() => {
    // Fetch banner design preference from Firebase
    const fetchDesign = async () => {
      try {
        const designRef = ref(db, 'settings/bannerDesign')
        const snapshot = await get(designRef)
        if (snapshot.exists()) {
          setBannerDesign(snapshot.val())
        }
      } catch (error) {
        console.log('Using default design')
      }
    }
    fetchDesign()
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <div className="layout">
      <header className={`header ${bannerDesign}`}>
        <div className="header-content">
          <Link to="/" className="logo">
            <div style={{ lineHeight: '1.1', textAlign: 'center' }}>
              <div>ABACUS ELECTRICAL</div>
              <div>SCOTLAND</div>
            </div>
          </Link>
          <nav>
            <ul className="nav-menu">
              <li>
                <Link to="/" className={isActive('/') ? 'active' : ''}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className={isActive('/services') ? 'active' : ''}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className={isActive('/gallery') ? 'active' : ''}>
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/before-after" className={isActive('/before-after') ? 'active' : ''}>
                  Before & After
                </Link>
              </li>
              <li>
                <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <Link to="/admin" className={`admin-link ${isActive('/admin') ? 'active' : ''}`}>
          Admin
        </Link>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Abacus Electrical Scotland</h4>
            <p>Professional electrical services for domestic and commercial customers.</p>
            <p>Qualified, certified, and fully insured.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Phone: {import.meta.env.VITE_COMPANY_PHONE || '(+44) XXX'}</p>
            <p>Email: {import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectrical.co.uk'}</p>
            <p>Address: {import.meta.env.VITE_COMPANY_ADDRESS || 'Scotland'}</p>
          </div>
          <div className="footer-section">
            <h4>Get a Quote</h4>
            <p>Need a free quote? Get in touch with us today.</p>
            <Link to="/contact" className="btn btn-small">
              Request Quote
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Abacus Electrical Scotland. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
