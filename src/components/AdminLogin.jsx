import { useState } from 'react'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Check password against environment variable
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      // Store login in session storage
      sessionStorage.setItem('adminLoggedIn', 'true')
      onLogin()
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  return (
    <div className="layout">
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>🔐 Admin Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {error && (
              <div style={{
                color: 'var(--color-accent)',
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn" style={{ width: '100%' }}>
              Login to Admin Panel
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', opacity: 0.6 }}>
            This is the admin control panel for managing quotes, work types, testimonials, and more.
          </p>
        </div>
      </main>
    </div>
  )
}
