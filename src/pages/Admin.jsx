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
  { name: 'Midnight Black', hex: '#111111' },
  { name: 'Rose Gold', hex: '#E0C1B0' },
  { name: 'Jade Green', hex: '#00A86B' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Arctic Blue', hex: '#3B7A57' },
  { name: 'Silver Metallic', hex: '#C0C0C0' },
  { name: 'Cherry Red', hex: '#990000' }
]

export default function Admin() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 42 })

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
        <div className="admin-logo">
          <h2>PRIORITY <span>ADMIN</span></h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
             Inventory
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
             Shop Orders
          </NavLink>
          <div className="nav-divider" />
          <Link to="/" className="nav-item">Switch to Website</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <section className="admin-content">
          <Routes>
            <Route index element={<DashboardOverview stats={stats} />} />
            <Route path="products" element={<ProductManagement token={token} refreshStats={refreshData} />} />
          </Routes>
        </section>
      </main>
    </div>
  )
}

function DashboardOverview({ stats }) {
  return (
     <div className="dashboard-simple">
        <h1>Overview</h1>
        <div className="stats-grid">
           <div className="stat-card"><h3>₹4.2L</h3><p>Revenue</p></div>
           <div className="stat-card"><h3>124</h3><p>Sales</p></div>
           <div className="stat-card"><h3>{stats.products}</h3><p>Products</p></div>
        </div>
     </div>
  )
}

function ProductManagement({ token, refreshStats }) {
  const [products, setProducts] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    name: '', category: 'Luggage', sub_category: '', price: '', stock: 10, 
    image_url: '', badge: 'None', colors: [], description: ''
  })

  const load = () => fetch('/api/v1/catalog/products').then(r => r.json()).then(d => setProducts(d.data || []))
  useEffect(() => { load() }, [])

  // Fix category/subcategory sync
  useEffect(() => {
    const subs = CATEGORY_MAP[form.category] || []
    if (!subs.includes(form.sub_category)) setForm(f => ({ ...f, sub_category: subs[0] || '' }))
  }, [form.category])

  const toggleColor = (name) => {
    setForm(prev => {
      const colors = prev.colors.includes(name) ? prev.colors.filter(c => c !== name) : [...prev.colors, name]
      return { ...prev, colors }
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
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
      else alert('Deployment Error: Vercel does not allow local file uploads. Try using an External URL.')
    } catch { alert('Upload error') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.image_url) return alert('Enter Image URL or Upload')
    try {
      setLoading(true)
      const res = await fetch('/api/v1/catalog/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: +form.price, original_price: +form.price })
      })
      if (res.ok) {
        setShowAdd(false)
        setForm({ name: '', category: 'Luggage', sub_category: '', price: '', stock: 10, image_url: '', badge: 'None', colors: [], description: '' })
        load(); refreshStats()
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="products-view">
       <div className="view-header">
          <h1>Inventory</h1>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>+ New Item</button>
       </div>

       {showAdd && (
         <div className="admin-modal-overlay">
           <div className="admin-modal">
             <div className="modal-header"><h3>Product Details</h3><button onClick={() => setShowAdd(false)}>×</button></div>
             <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                  <div className="form-group grid-span-2"><label>Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                  
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                       {Object.keys(CATEGORY_MAP).map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sub-Category</label>
                    <select value={form.sub_category} onChange={e => setForm({...form, sub_category: e.target.value})}>
                       {(CATEGORY_MAP[form.category] || []).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-group"><label>Price (₹)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
                  <div className="form-group">
                    <label>Display Label</label>
                    <select value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}><option>None</option><option>New</option><option>Bestseller</option></select>
                  </div>

                  <div className="form-group grid-span-2">
                    <label>Description</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>

                  <div className="form-group grid-span-2">
                    <label>Select Available Colors</label>
                    <div className="admin-color-dots">
                      {PRESET_COLORS.map(c => (
                        <div key={c.name} className={`color-pick ${form.colors.includes(c.name)?'active':''}`} onClick={() => toggleColor(c.name)} title={c.name}>
                          <span className="dot" style={{ background: c.hex }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Image Source</label>
                  <div className="image-choice">
                    <input type="text" placeholder="Paste External Image URL (Better for Vercel)" value={form.image_url} onChange={e=>setForm({...form, image_url: e.target.value})} className="url-input" />
                    <div className="divider"><span>OR</span></div>
                    <div className="upload-box-simple">
                       <input type="file" onChange={handleUpload} id="file-up" style={{display:'none'}} />
                       <label htmlFor="file-up" className="up-btn">{loading?'Processing...':'Upload Local Image'}</label>
                       {form.image_url && <span className="up-success">✓ Photo set</span>}
                    </div>
                  </div>
                </div>

                <div className="modal-footer"><button type="submit" className="btn-save">Launch Product</button></div>
             </form>
           </div>
         </div>
       )}

       <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><div className="item-cell"><img src={p.image_url} alt="" /><span>{p.name}</span></div></td>
                  <td>{p.category} / {p.sub_category}</td>
                  <td>₹{p.price?.toLocaleString()}</td>
                  <td><button className="del-btn" onClick={() => handleDelete(p.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  )
}
