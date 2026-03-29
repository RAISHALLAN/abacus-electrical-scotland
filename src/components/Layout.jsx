import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../utils/firebase'
import { ref, get } from 'firebase/database'

export default function Layout({ children }) {
  const location = useLocation()
  const [bannerDesign, setBannerDesign] = useState('design-wires')
  const [socialLinks, setSocialLinks] = useState({ facebook: '', instagram: '', tiktok: '', youtube: '' })
  const [contactInfo, setContactInfo] = useState({
    phone: import.meta.env.VITE_COMPANY_PHONE || '+44 7931768138',
    email: import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectricalscotland.co.uk',
    address: import.meta.env.VITE_COMPANY_ADDRESS || 'Scotland',
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const designRef = ref(db, 'settings/bannerDesign')
        const snapshot = await get(designRef)
        if (snapshot.exists()) {
          setBannerDesign(snapshot.val())
        }
        const socialRef = ref(db, 'settings/socialLinks')
        const socialSnap = await get(socialRef)
        if (socialSnap.exists()) {
          setSocialLinks({ facebook: '', instagram: '', tiktok: '', youtube: '', ...socialSnap.val() })
        }
        const contactRef = ref(db, 'settings/contactInfo')
        const contactSnap = await get(contactRef)
        if (contactSnap.exists()) {
          setContactInfo(prev => ({ ...prev, ...contactSnap.val() }))
        }
      } catch (error) {
        console.log('Using default settings')
      }
    }
    fetchSettings()
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
            <h4>Follow Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.25rem' }}>
              {[
                { key: 'facebook',  label: 'Facebook',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                { key: 'instagram', label: 'Instagram', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                { key: 'tiktok',    label: 'TikTok',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg> },
                { key: 'youtube',   label: 'YouTube',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#000"/></svg> },
              ].filter(({ key }) => socialLinks[key])
                .map(({ key, label, icon }) => (
                <a
                  key={key}
                  href={socialLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', opacity: 0.75, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.75}
                >
                  {icon}{label}
                </a>
              ))}
              {!Object.values(socialLinks).some(Boolean) && (
                <p style={{ opacity: 0.45, fontSize: '0.85rem', margin: 0 }}>Coming soon</p>
              )}
            </div>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Phone: {contactInfo.phone}</p>
            <p>Email: {contactInfo.email}</p>
            <p>Address: {contactInfo.address}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Abacus Electrical Scotland. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
