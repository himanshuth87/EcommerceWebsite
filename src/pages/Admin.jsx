import { useState, useEffect } from 'react'
import { NavLink, useNavigate, Routes, Route, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Admin.css'

const CATEGORY_MAP = {
  'Backpack': ['School', 'College', 'Laptop'],
  'Luggage': ['Duffle', 'Trekking', 'Hard Luggage'],
  'Accessories': ['Pouches', 'Lunch Bags', 'Shopping Bag']
}

const PRESET_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'Rose', hex: '#E0C1B0' },
  { name: 'Jade', hex: '#00A86B' },
  { name: 'Forest', hex: '#228B22' },
  { name: 'Blue', hex: '#3B7A57' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Red', hex: '#990000' }
]

export default function Admin() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })

  const refreshData = async () => {
    try {
      const res = await fetch('/api/v1/catalog/products')
      const d = await res.json()
      setStats(prev => ({ ...prev, products: d.data?.length || 0 }))
    } catch (e) { console.error(e) }
  }

  useEffect(() => { if (token) refreshData() }, [token])

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo"><h2>PRIORITY <span>ADMIN</span></h2></div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className="nav-item">Dashboard</NavLink>
          <NavLink to="/admin/products" className="nav-item">Inventory</NavLink>
          <div className="nav-divider" />
          <Link to="/" className="nav-item">Switch to Website</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <section className="admin-content">
          <Routes>
            <Route index element={<div className="view-header"><h1>Overview</h1></div>} />
            <Route path="products" element={<ProductManagement token={token} refreshStats={refreshData} />} />
          </Routes>
        </section>
      </main>
    </div>
  )
}

function ProductManagement({ token, refreshStats }) {
  const [products, setProducts] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    name: '', category: 'Backpack', sub_category: '', price: '', stock: 0, 
    image_url: '', badge: 'None', colors: [], description: ''
  })

  const load = () => fetch('/api/v1/catalog/products').then(r => r.json()).then(d => setProducts(d.data || []))
  useEffect(() => { load() }, [])

  useEffect(() => {
    const subs = CATEGORY_MAP[form.category] || []
    if (!subs.includes(form.sub_category)) setForm(f => ({ ...f, sub_category: subs[0] || '' }))
  }, [form.category])

  const toggleColor = (name) => {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.includes(name) ? prev.colors.filter(c => c !== name) : [...prev.colors, name]
    }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete product?')) return
    await fetch(`/api/v1/catalog/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    load(); refreshStats()
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const formData = new FormData(); formData.append('image', file)
    try {
      setLoading(true)
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData })
      const d = await res.json()
      if (d.success) setForm(prev => ({ ...prev, image_url: d.url }))
      else alert('Deployment Limitation: Local uploads are disabled on Vercel. Please use the "Paste URL" field instead.')
    } finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.image_url) return alert('Photo required')
    try {
      setLoading(true)
      const res = await fetch('/api/v1/catalog/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: +form.price, original_price: +form.price })
      })
      if (res.ok) {
        setShowAdd(false); load(); refreshStats()
        setForm({ name: '', category: 'Backpack', sub_category: '', price: '', stock: 0, image_url: '', badge: 'None', colors: [], description: '' })
      } else {
        const er = await res.json()
        alert(er.error || 'Add failed')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="products-view">
       <div className="view-header">
          <h1>Manage Inventory</h1>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>+ ADD PRODUCT</button>
       </div>

       {showAdd && (
         <div className="admin-modal-overlay">
           <div className="admin-modal">
             <div className="modal-header"><h3>Add New Item</h3><button onClick={() => setShowAdd(false)}>×</button></div>
             <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                  <div className="form-group grid-span-2"><label>Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                  <div className="form-group"><label>Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{Object.keys(CATEGORY_MAP).map(k => <option key={k}>{k}</option>)}</select></div>
                  <div className="form-group"><label>Sub-Category</label><select value={form.sub_category} onChange={e => setForm({...form, sub_category: e.target.value})}>{(CATEGORY_MAP[form.category] || []).map(s => <option key={s}>{s}</option>)}</select></div>
                  <div className="form-group"><label>Rate (₹)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
                  <div className="form-group"><label>Initial Units</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} /></div>
                  <div className="form-group grid-span-2">
                    <label>Colors</label>
                    <div className="admin-color-dots">
                      {PRESET_COLORS.map(c => (
                        <div key={c.name} className={`color-pick ${form.colors.includes(c.name)?'active':''}`} onClick={() => toggleColor(c.name)} title={c.name}><span className="dot" style={{ background: c.hex }} /></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Image Source</label>
                  <input type="text" placeholder="Paste External Photo URL" value={form.image_url} onChange={e=>setForm({...form, image_url: e.target.value})} className="url-input" />
                </div>
                <div className="modal-footer"><button type="submit" className="btn-save">{loading ? 'Saving...' : 'Confirm Launch'}</button></div>
             </form>
           </div>
         </div>
       )}

       <div className="inventory-grid">
         {products.map(p => (
           <div key={p.id} className="inventory-card">
              <div className="card-top">
                 <div className="select-box"><input type="checkbox" /></div>
                 <img src={p.image_url} alt="" />
                 <div className="card-actions">
                    <button className="icon-btn del" onClick={() => handleDelete(p.id)} title="Delete item">×</button>
                 </div>
              </div>
              <div className="card-body">
                 <p className="card-cat">{p.category?.toUpperCase()} • {p.sub_category?.toUpperCase()}</p>
                 <h3 className="card-title">{p.name || 'Untitled Item'}</h3>
                 <div className="card-colors">
                    {(p.colors || []).length > 0 ? p.colors.map(c => (
                      <span key={c} className="color-dot" style={{ background: PRESET_COLORS.find(pc => pc.name === c)?.hex || '#ccc' }} />
                    )) : <span className="no-colors">No colors set</span>}
                 </div>
                 <div className="card-footer">
                    <div className="footer-price">
                       <span className="old-price">₹{Math.floor(p.price*1.1)}</span>
                       <span className="main-price">₹{p.price?.toLocaleString()}</span>
                    </div>
                    <div className="footer-stock">
                       <p className="stock-label">INVENTORY</p>
                       <p className="stock-val">{p.stock || 0} Units</p>
                    </div>
                 </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  )
}
