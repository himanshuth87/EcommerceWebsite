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
  { name: 'Black', hex: '#111111' }, { name: 'Rose', hex: '#E0C1B0' }, { name: 'Jade', hex: '#00A86B' },
  { name: 'Forest', hex: '#228B22' }, { name: 'Blue', hex: '#3B7A57' }, { name: 'Silver', hex: '#C0C0C0' }, { name: 'Red', hex: '#990000' }
]

export default function Admin() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0 })

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
        users: 42 // Mock or separate api later
      })
    } catch (e) { console.error(e) }
  }

  useEffect(() => { if (token) loadBaseStats() }, [token])

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo"><h2>PRIORITY <span>ADMIN</span></h2></div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className="nav-item">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className="nav-item">
            <span className="material-symbols-outlined">inventory_2</span> Inventory
          </NavLink>
          <NavLink to="/admin/orders" className="nav-item">
            <span className="material-symbols-outlined">shopping_bag</span> Orders
          </NavLink>
          <NavLink to="/admin/users" className="nav-item">
            <span className="material-symbols-outlined">group</span> My Users
          </NavLink>
          <div className="nav-divider" />
          <Link to="/" className="nav-item">
            <span className="material-symbols-outlined">logout</span> Storefront
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <section className="admin-content">
          <Routes>
            <Route index element={<DashboardOverview stats={stats} />} />
            <Route path="products" element={<ProductManagement token={token} refreshStats={loadBaseStats} />} />
            <Route path="orders" element={<OrderManagement token={token} />} />
            <Route path="users" element={<UserManagement token={token} />} />
          </Routes>
        </section>
      </main>
    </div>
  )
}

function DashboardOverview({ stats }) {
  return (
    <div className="dashboard-content">
      <h1 className="page-title">Sales Overview</h1>
      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">GROSS REVENUE</p>
          <h2 className="kpi-value">₹{(stats.revenue / 100).toLocaleString()}</h2>
          <p className="kpi-trend up">+12% vs last month</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">TOTAL ORDERS</p>
          <h2 className="kpi-value">{stats.orders}</h2>
          <p className="kpi-trend up">+8.2%</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">AVG ORDER VALUE</p>
          <h2 className="kpi-value">₹{stats.orders > 0 ? (stats.revenue / 100 / stats.orders).toFixed(0) : '0'}</h2>
          <p className="kpi-trend">Consistent</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">TOTAL USERS</p>
          <h2 className="kpi-value">{stats.users}</h2>
          <p className="kpi-trend up">+2 today</p>
        </div>
      </div>

      <div className="recent-activity">
         <h3>Performance Highlights</h3>
         <div className="performance-chart-mock">
            <div className="bar" style={{height: '60%'}}></div>
            <div className="bar" style={{height: '40%'}}></div>
            <div className="bar" style={{height: '80%'}}></div>
            <div className="bar" style={{height: '55%'}}></div>
            <div className="bar" style={{height: '90%'}}></div>
         </div>
      </div>
    </div>
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

  const toggleColor = (name) => {
    setForm(prev => ({
      ...prev, colors: prev.colors.includes(name) ? prev.colors.filter(c => c !== name) : [...prev.colors, name]
    }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete item?')) return
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
      if (res.ok) {
        setShowForm(false); setEditingProduct(null); load(); refreshStats()
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="inventory-view">
       <div className="view-header">
          <h1>Inventory Catalog</h1>
          <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true) }}>+ NEW PRODUCT</button>
       </div>

       {showForm && (
         <div className="admin-modal-overlay">
           <div className="admin-modal">
             <div className="modal-header">
               <h3>{editingProduct ? 'Update Product' : 'Add New Item'}</h3>
               <button onClick={() => setShowForm(false)}>×</button>
             </div>
             <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                  <div className="form-group grid-span-2"><label>Title</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div className="form-group"><label>Category</label>
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                      {Object.keys(CATEGORY_MAP).map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Sub-Cat</label>
                    <select value={form.sub_category} onChange={e=>setForm({...form,sub_category:e.target.value})}>
                      {(CATEGORY_MAP[form.category] || []).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Rate (₹)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
                  <div className="form-group"><label>Units</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} /></div>
                  <div className="form-group grid-span-2"><label>Available Colors</label>
                    <div className="admin-color-dots">
                      {PRESET_COLORS.map(c => (
                        <div key={c.name} className={`color-pick ${form.colors.includes(c.name)?'active':''}`} onClick={()=>toggleColor(c.name)}><span className="dot" style={{background:c.hex}}/></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="text" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="url-input" />
                </div>
                <div className="modal-footer"><button type="submit" className="btn-save">{loading?'Saving...': (editingProduct?'Update Item':'Launch Item')}</button></div>
             </form>
           </div>
         </div>
       )}

       <div className="inventory-grid">
         {products.map(p => {
           const clrs = typeof p.colors === 'string' ? JSON.parse(p.colors) : (p.colors || [])
           return (
             <div key={p.id} className="inventory-card">
                <div className="card-top">
                   <img src={p.image_url} alt="" />
                   <div className="card-actions">
                      <button className="icon-btn edit" onClick={() => { setEditingProduct(p); setShowForm(true) }}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="icon-btn del" onClick={() => handleDelete(p.id)}>×</button>
                   </div>
                </div>
                <div className="card-body">
                   <p className="card-cat">{p.category?.toUpperCase()} • {p.sub_category?.toUpperCase()}</p>
                   <h3 className="card-title">{p.name}</h3>
                   <div className="card-colors">
                      {clrs.map(c => <span key={c} className="color-dot" style={{background: PRESET_COLORS.find(pc => pc.name === c)?.hex}} />)}
                   </div>
                   <div className="card-footer">
                      <div className="footer-price"><span>₹{p.price?.toLocaleString()}</span></div>
                      <div className="footer-stock"><p className="stock-val">{p.stock} Units</p></div>
                   </div>
                </div>
             </div>
           )
         })}
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
    <div className="orders-view">
      <h1 className="page-title">Sale Orders</h1>
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Status</th><th>Total</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.order_id}</td>
                <td>{o.customer_name}</td>
                <td><span className={`status-pill ${o.status}`}>{o.status}</span></td>
                <td>₹{(o.amount / 100).toLocaleString()}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserManagement({ token }) {
  return (
    <div className="users-view">
       <h1 className="page-title">Customer Database</h1>
       <div className="empty-state">
          <span className="material-symbols-outlined">group</span>
          <p>42 Verified Customers registered. CRM integration pending.</p>
       </div>
    </div>
  )
}
