import { useState } from 'react'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '../utils/firebase'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setLoading(true)
      try {
        // Sign in anonymously with Firebase so Storage/Auth rules are satisfied
        await signInAnonymously(auth)
      } catch (authErr) {
        console.warn('Firebase anonymous sign-in failed:', authErr.message)
        // Continue anyway — database features still work without this
      }
      sessionStorage.setItem('adminLoggedIn', 'true')
      onLogin()
      setLoading(false)
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

            <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
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
