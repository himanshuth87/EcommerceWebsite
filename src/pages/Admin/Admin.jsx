import { useState, useEffect } from 'react'
import { NavLink, useNavigate, Routes, Route, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './Admin.css'

const CATEGORY_MAP = {
  'Backpack': ['School', 'College', 'Laptop'],
  'Luggage': ['Duffle', 'Trekking', 'Hard Luggage'],
  'Accessories': ['Pouches', 'Lunch Bags', 'Shopping Bag']
}

const PRESET_COLORS = [
  { name: 'Black', hex: '#111111' }, { name: 'Rose', hex: '#E0C1B0' }, { name: 'Jade', hex: '#00A86B' },
  { name: 'Forest', hex: '#228B22' }, { name: 'Blue', hex: '#3B7A57' }, { name: 'Silver', hex: '#C0C0C0' }, { name: 'Red', hex: '#990000' }
]

export default function Admin() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 48 })

  const loadBaseStats = async () => {
    try {
      const rp = await fetch('/api/v1/catalog/products')
      const dp = await rp.json()
      const ro = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } })
      const doat = await ro.json()
      setStats({
        products: dp.data?.length || 0,
        orders: doat.data?.length || 0,
        revenue: (doat.data || []).reduce((acc, o) => acc + (o.amount || 0), 0),
        users: 48
      })
    } catch (e) { console.error(e) }
  }

  useEffect(() => { if (token) loadBaseStats() }, [token])

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>PRIORITY <span>Control Center</span></h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className="nav-item">
            <span className="material-symbols-outlined">analytics</span> Overview
          </NavLink>
          <NavLink to="/admin/products" className="nav-item">
            <span className="material-symbols-outlined">inventory_2</span> Archive
          </NavLink>
          <NavLink to="/admin/orders" className="nav-item">
            <span className="material-symbols-outlined">shopping_bag</span> Requests
          </NavLink>
          <NavLink to="/admin/users" className="nav-item">
            <span className="material-symbols-outlined">group</span> Clients
          </NavLink>
          <div style={{ padding: '0 40px', marginTop: '40px' }}>
            <Link to="/" className="nav-item" style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="material-symbols-outlined">logout</span> Storefront
            </Link>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route index element={<DashboardOverview stats={stats} />} />
          <Route path="products" element={<ProductManagement token={token} refreshStats={loadBaseStats} />} />
          <Route path="orders" element={<OrderManagement token={token} />} />
          <Route path="users" element={<UserManagement token={token} />} />
        </Routes>
      </main>
    </div>
  )
}

function DashboardOverview({ stats }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="page-title">Operational <span>Insights</span></h1>
      
      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">Revenue</p>
          <h2 className="kpi-value">₹{(stats.revenue / 100).toLocaleString()}</h2>
          <p className="kpi-trend up">↑ 14% growth</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Orders</p>
          <h2 className="kpi-value">{stats.orders}</h2>
          <p className="kpi-trend">Consistent delivery</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Archive Size</p>
          <h2 className="kpi-value">{stats.products}</h2>
          <p className="kpi-trend">Skus active</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Client Base</p>
          <h2 className="kpi-value">{stats.users}</h2>
          <p className="kpi-trend up">↑ 2 new today</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div style={{ padding: '32px' }}>
          <h3 style={{ fontFamily: 'Noto Serif', fontSize: '1.25rem' }}>Network Performance</h3>
          <div className="performance-chart-mock">
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={i} 
                className="bar" 
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 100 + 10}%` }}
                transition={{ duration: 1, delay: i * 0.05 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProductManagement({ token, refreshStats }) {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', category: 'Backpack', sub_category: '', price: '', stock: 0, 
    image_url: '', badge: 'None', colors: [], description: ''
  })

  const load = () => fetch('/api/v1/catalog/products').then(r => r.json()).then(d => setProducts(d.data || []))
  useEffect(() => { load() }, [])

  useEffect(() => {
    if (editingProduct) {
      const colors = typeof editingProduct.colors === 'string' ? JSON.parse(editingProduct.colors) : (editingProduct.colors || [])
      setForm({ ...editingProduct, colors, price: String(editingProduct.price) })
    } else {
      setForm({ name: '', category: 'Backpack', sub_category: '', price: '', stock: 0, image_url: '', badge: 'None', colors: [], description: '' })
    }
  }, [editingProduct])

  const handleDelete = async (id) => {
    if (!window.confirm('Archive item?')) return
    await fetch(`/api/v1/catalog/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    load(); refreshStats()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = editingProduct ? `/api/v1/catalog/products/${editingProduct.id}` : '/api/v1/catalog/products'
      const method = editingProduct ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: +form.price, original_price: +form.price })
      })
      if (res.ok) { setShowForm(false); setEditingProduct(null); load(); refreshStats() }
    } finally { setLoading(false) }
  }

  return (
    <div className="inventory-view">
      <div className="view-header">
        <h1 className="page-title">Catalog <span>Archive</span></h1>
        <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true) }}>+ Curate New Item</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="modal-header">
                <h3>{editingProduct ? 'Refine Design' : 'Curate Design'}</h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group"><label>Title</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group"><label>Classification</label>
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                      {Object.keys(CATEGORY_MAP).map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Value (₹)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
                </div>
                <div className="form-group"><label>Media Reference (URL)</label><input type="text" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} /></div>
                <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Processing...' : 'Deploy to Catalog'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="inventory-grid">
        {products.map((p, index) => (
          <motion.div 
            key={p.id} 
            className="inventory-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="card-top">
              <img src={p.image_url} alt="" onError={e => { e.target.src = '/assets/Category/Travelling Bag.png' }} />
              <div className="card-actions">
                <button className="icon-btn" onClick={() => { setEditingProduct(p); setShowForm(true) }}><span className="material-symbols-outlined">edit</span></button>
                <button className="icon-btn" onClick={() => handleDelete(p.id)}><span className="material-symbols-outlined">delete</span></button>
              </div>
            </div>
            <div className="card-body">
              <p className="card-cat">{p.category} // {p.sub_category}</p>
              <h3 className="card-title">{p.name}</h3>
              <div className="card-footer">
                <div className="footer-price">₹{p.price?.toLocaleString()}</div>
                <div className="stock-val">{p.stock} Units</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function OrderManagement({ token }) {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(d => setOrders(d.data || []))
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Service <span>Requests</span></h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Status</th><th>Value</th><th>Timestamp</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.order_id?.slice(-6).toUpperCase()}</td>
                <td>{o.customer_name}</td>
                <td><span className={`status-pill ${o.status}`}>{o.status}</span></td>
                <td>₹{(o.amount / 100).toLocaleString()}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function UserManagement({ token }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
       <h1 className="page-title">Client <span>Ledger</span></h1>
       <div style={{ padding: '64px', background: 'var(--at-surface-high)', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '4rem', opacity: 0.1, marginBottom: '24px' }}>group</span>
          <p className="kpi-label">48 Verified Clients</p>
          <p style={{ opacity: 0.5 }}>CRM Integration is currently in staging.</p>
       </div>
    </motion.div>
  )
}
