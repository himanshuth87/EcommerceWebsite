import { useState, useEffect } from 'react'
import { NavLink, useNavigate, Routes, Route, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Admin.css'

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
            <span className="material-symbols-outlined">dashboard</span>
            Overview
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined">inventory_2</span>
            Products
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined">shopping_cart</span>
            Orders
          </NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined">group</span>
            Customers
          </NavLink>
          <div className="nav-divider" />
          <Link to="/" className="nav-item">
            <span className="material-symbols-outlined">home</span>
            View Store
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
           <div className="header-search">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search orders, products..." />
           </div>
           <div className="header-user">
              <div className="user-info">
                 <p className="user-name">{user?.name || 'Administrator'}</p>
                 <p className="user-role">Super Admin</p>
              </div>
              <div className="user-avatar">
                 {user?.name?.[0] || 'A'}
              </div>
           </div>
        </header>

        <section className="admin-content">
          <Routes>
            <Route index element={<DashboardOverview stats={stats} />} />
            <Route path="products" element={<ProductManagement token={token} refreshStats={refreshData} />} />
            <Route path="orders" element={<div className="view-header"><h1 className="page-title">Orders Management</h1></div>} />
            <Route path="customers" element={<div className="view-header"><h1 className="page-title">Customer Database</h1></div>} />
          </Routes>
        </section>
      </main>
    </div>
  )
}

function DashboardOverview({ stats }) {
  return (
     <div className="dashboard-view">
        <h1 className="page-title">Admin Dashboard</h1>
        <div className="stats-grid">
           <div className="stat-card">
              <div className="stat-icon revenue"><span className="material-symbols-outlined">payments</span></div>
              <div className="stat-info">
                 <p className="stat-label">Total Revenue</p>
                 <h3 className="stat-value">₹4,28,950</h3>
                 <p className="stat-change up">+12.5% vs last month</p>
              </div>
           </div>
           <div className="stat-card">
              <div className="stat-icon orders"><span className="material-symbols-outlined">shopping_bag</span></div>
              <div className="stat-info">
                 <p className="stat-label">Total Orders</p>
                 <h3 className="stat-value">124</h3>
                 <p className="stat-change up">+8.2% vs last month</p>
              </div>
           </div>
           <div className="stat-card">
              <div className="stat-icon products"><span className="material-symbols-outlined">inventory</span></div>
              <div className="stat-info">
                 <p className="stat-label">Total Products</p>
                 <h3 className="stat-value">{stats.products}</h3>
                 <p className="stat-change">Database driven</p>
              </div>
           </div>
           <div className="stat-card">
              <div className="stat-icon customers"><span className="material-symbols-outlined">group</span></div>
              <div className="stat-info">
                 <p className="stat-label">Daily Visitors</p>
                 <h3 className="stat-value">1,240</h3>
                 <p className="stat-change down">-2.1% today</p>
              </div>
           </div>
        </div>

        <div className="dashboard-charts-grid">
           <div className="chart-container large">
              <div className="chart-header">
                 <h4>Recent Orders</h4>
                 <Link to="/admin/orders" className="view-link">View All</Link>
              </div>
              <div className="recent-table-wrap">
                 <table className="admin-table">
                   <thead>
                     <tr>
                       <th>Order ID</th>
                       <th>Customer</th>
                       <th>Date</th>
                       <th>Amount</th>
                       <th>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <td className="order-id">#ORD-2849</td>
                       <td className="customer-name">Amit Sharma</td>
                       <td>Mar 23, 2026</td>
                       <td>₹24,999</td>
                       <td><span className="status-pill status-paid">Paid</span></td>
                     </tr>
                     <tr>
                       <td className="order-id">#ORD-2850</td>
                       <td className="customer-name">Priya Jha</td>
                       <td>Mar 22, 2026</td>
                       <td>₹12,499</td>
                       <td><span className="status-pill status-pending">Processing</span></td>
                     </tr>
                   </tbody>
                 </table>
              </div>
           </div>
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
    image_url: '', badge: 'None', colors_text: '', description: ''
  })

  const load = () => fetch('/api/v1/catalog/products').then(r => r.json()).then(d => setProducts(d.data || []))
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product from the database?')) return
    try {
      const res = await fetch(`/api/v1/catalog/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
        refreshStats()
      } else {
        const er = await res.json()
        alert(er.error || 'Delete failed')
      }
    } catch (e) { alert('Network error while deleting') }
  }

  const handleSeed = async () => {
    if (!window.confirm('This will copy all products from the local JSON file to your database. Continue?')) return
    try {
      setLoading(true)
      const res = await fetch('/api/admin/seed', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const d = await res.json()
      alert(d.message)
      load()
      refreshStats()
    } catch (e) { alert('Seed failed') }
    finally { setLoading(false) }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    try {
      setLoading(true)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const d = await res.json()
      if (d.success) setForm(prev => ({ ...prev, image_url: d.url }))
      else alert('Upload failed')
    } catch (e) { alert('Error uploading') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.image_url) return alert('Please upload an image first')
    try {
      setLoading(true)
      const res = await fetch('/api/v1/catalog/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          original_price: Number(form.price),
          colors: form.colors_text.split(',').map(c => c.trim()).filter(c => c),
          is_premium: form.category === 'Premium'
        })
      })
      if (res.ok) {
        setShowAdd(false)
        setForm({ name: '', category: 'Luggage', sub_category: '', price: '', stock: 10, image_url: '', badge: 'None', colors_text: '', description: '' })
        load()
        refreshStats()
      }
    } catch (e) { alert('Failed to add product') }
    finally { setLoading(false) }
  }

  return (
    <div className="products-view">
       <div className="view-header">
          <h1 className="page-title">Manage Products</h1>
          <div className="header-actions">
            <button className="btn-secondary" onClick={handleSeed} disabled={loading}>
               <span className="material-symbols-outlined">sync</span>
               Sync from JSON
            </button>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
               <span className="material-symbols-outlined">add</span>
               Add Product
            </button>
          </div>
       </div>

       {products.length === 0 && !loading && (
         <div className="empty-state-alert">
            <span className="material-symbols-outlined">database_off</span>
            <p>Your database is empty. Click <strong>Sync from JSON</strong> above to import baseline products.</p>
         </div>
       )}

       {showAdd && (
         <div className="admin-modal-overlay">
           <div className="admin-modal">
             <div className="modal-header">
               <h3>Add New Product</h3>
               <button onClick={() => setShowAdd(false)} className="close-btn">×</button>
             </div>
             <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                  <div className="form-group grid-span-2">
                    <label>Product Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                       <option>Luggage</option>
                       <option>Backpacks</option>
                       <option>Premium</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sub Category</label>
                    <input type="text" value={form.sub_category} onChange={e => setForm({...form, sub_category: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Placement</label>
                    <select value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}>
                       <option>None</option>
                       <option>New</option>
                       <option>Bestseller</option>
                    </select>
                  </div>
                  <div className="form-group grid-span-2">
                    <label>Description</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <div className="upload-box">
                    {form.image_url ? (
                      <div className="preview-wrap">
                        <img src={form.image_url} alt="preview" />
                        <button type="button" onClick={() => setForm({...form, image_url: ''})}>Change</button>
                      </div>
                    ) : (
                      <div className="upload-trigger">
                        <span className="material-symbols-outlined">cloud_upload</span>
                        <p>{loading ? 'Uploading...' : 'Upload Image'}</p>
                        <input type="file" accept="image/*" onChange={handleUpload} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                   <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                   <button type="submit" className="btn-primary" disabled={loading}>Save</button>
                </div>
             </form>
           </div>
         </div>
       )}
       
       <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                       <img src={p.image_url} alt="" className="table-img" />
                       <div className="table-product-details">
                          <span className="table-product-name">{p.name}</span>
                       </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>₹{p.price?.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="table-actions">
                       <button className="action-btn delete" onClick={() => handleDelete(p.id)}><span className="material-symbols-outlined">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  )
}
