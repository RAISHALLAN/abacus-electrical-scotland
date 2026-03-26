import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDashboard from '../components/AdminDashboard'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has valid session token
    const token = localStorage.getItem('adminToken')
    if (token) {
      // In production, verify token with backend
      const tokenTime = localStorage.getItem('adminTokenTime')
      const now = new Date().getTime()
      if (now - tokenTime < 3600000) { // 1 hour
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminTokenTime')
      }
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    // TODO: Call backend function to verify password
    // For now, using a simple client-side check (not secure for production)
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

    if (password === adminPassword) {
      localStorage.setItem('adminToken', 'true')
      localStorage.setItem('adminTokenTime', new Date().getTime().toString())
      setIsAuthenticated(true)
      setPassword('')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminTokenTime')
    setIsAuthenticated(false)
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '3rem auto' }}>
        <div className="card">
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Panel</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            {error && <p style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>⚠ {error}</p>}
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <AdminDashboard />
    </div>
  )
}
