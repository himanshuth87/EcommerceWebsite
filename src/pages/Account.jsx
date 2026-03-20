import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import './Account.css'

export default function Account() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  if (!isLoggedIn) return (
    <div className="account-gate">
      <div className="account-gate-inner">
        <span>🔐</span>
        <h2>Sign in to view your account</h2>
        <Link to="/login" className="btn btn-gold btn-lg">Sign In →</Link>
      </div>
    </div>
  )

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <main className="account-page">
      <div className="container">
        <div className="account-header">
          <div className="account-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h1 className="account-name">{user.name}</h1>
            <p className="account-email">{user.email}</p>
            {user.role === 'admin' && <span className="badge badge-premium">Admin</span>}
          </div>
        </div>

        <div className="account-grid">
          <div className="account-card card">
            <h3>My Orders</h3>
            <p>View and track your recent purchases.</p>
            <div className="account-empty-orders">
              <span>📦</span>
              <p>No orders yet. Start shopping!</p>
              <Link to="/products" className="btn btn-outline btn-sm">Shop Now →</Link>
            </div>
          </div>

          <div className="account-card card">
            <h3>Profile Details</h3>
            <div className="profile-detail"><label>Name</label><span>{user.name}</span></div>
            <div className="profile-detail"><label>Email</label><span>{user.email}</span></div>
            <div className="profile-detail"><label>Role</label><span style={{textTransform:'capitalize'}}>{user.role}</span></div>
          </div>

          <div className="account-card card">
            <h3>Wishlist</h3>
            <p>Your saved products will appear here.</p>
            <div className="account-empty-orders">
              <span>❤️</span>
              <p>No items saved yet.</p>
              <Link to="/products" className="btn btn-outline btn-sm">Browse Products</Link>
            </div>
          </div>

          <div className="account-card card account-actions-card">
            <h3>Quick Links</h3>
            <div className="quick-links">
              <Link to="/products" className="quick-link">🛍️ Shop All Products</Link>
              <Link to="/premium" className="quick-link">✦ Premium Collection</Link>
              <Link to="/about" className="quick-link">ℹ️ About Priority Bags</Link>
              <button onClick={handleLogout} className="quick-link quick-link-danger">🚪 Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
