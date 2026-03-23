import { useState } from 'react'
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

  const [tab, setTab] = useState('profile')
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <main className="account-page">
      <div className="container">
        <div className="account-header">
          <div className="account-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h1 className="account-name">{user.name}</h1>
            <p className="account-email">{user.email}</p>
            {user.role === 'admin' && <span className="badge badge-premium">Admin Access</span>}
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="admin-nav filter-tabs" style={{ marginBottom: 40, justifyContent: 'center' }}>
            <button className={`filter-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>My Profile</button>
            <button className={`filter-tab ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>Admin Panel</button>
          </div>
        )}

        {tab === 'admin' ? (
          <AdminPanel />
        ) : (
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

            <div className="account-card card account-actions-card">
              <h3>Quick Links</h3>
              <div className="quick-links">
                <Link to="/products" className="quick-link">🛍️ Shop All Products</Link>
                <Link to="/premium" className="quick-link">✦ Premium Collection</Link>
                <button onClick={handleLogout} className="quick-link quick-link-danger">🚪 Sign Out</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function AdminPanel() {
  const [form, setForm] = useState({
    name: '', category: 'Cabin Luggage', price: '', colors: '', image_url: '',
    variant_images: {} // Map color -> imageURL
  })
  const [msg, setMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call /api/v1/catalog/products
    setMsg('Feature implementation in progress: Product will be added to database.')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="admin-panel reveal">
      <div className="admin-card card">
        <h3>Add New Professional Product</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" placeholder="e.g. Neo-Matrix Carry-on" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
                <option>Cabin Luggage</option>
                <option>Check-in Luggage</option>
                <option>Backpacks</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" placeholder="9999" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>Base Image URL</label>
            <input type="text" placeholder="https://..." value={form.image_url} onChange={e=>setForm({...form, image_url: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Colors (Comma separated)</label>
            <input type="text" placeholder="Pink, Blue, Gold" value={form.colors} onChange={e=>setForm({...form, colors: e.target.value})} />
          </div>
          
          <div className="variants-section">
            <p className="pd-option-label" style={{marginBottom: 10}}>Color Variants (Professional Image Switch)</p>
            {form.colors.split(',').map(c => c.trim()).filter(Boolean).map(c => (
              <div key={c} className="variant-input-row" style={{display:'flex', gap: 10, marginBottom: 10}}>
                <span className="color-tag" style={{background: COLOR_MAP[c] || '#444', width: 24, height: 24, borderRadius: '50%'}}></span>
                <input 
                  type="text" 
                  placeholder={`Image URL for ${c}`} 
                  onChange={e => {
                    setForm({
                      ...form, 
                      variant_images: {...form.variant_images, [c]: e.target.value}
                    })
                  }}
                  className="variant-url-input"
                />
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-gold" style={{width:'100%', marginTop: 20}}>Add Product to Catalog</button>
          {msg && <p className="admin-msg">{msg}</p>}
        </form>
      </div>
    </div>
  )
}

const COLOR_MAP = {
  'Pink': '#ff85a1', 'Blue': '#4a90e2', 'Gold': '#d4af37',
  'Black': '#111', 'Platinum': '#e5e4e2', 'Rose Gold': '#b76e79'
}
