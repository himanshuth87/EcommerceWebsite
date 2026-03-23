import { useState, useEffect } from 'react'
import { NavLink, useNavigate, Routes, Route, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Admin.css'

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 42 })

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
            <Route path="products" element={<ProductManagement />} />
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
                 <h3 className="stat-value">16</h3>
                 <p className="stat-change">Active in store</p>
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
                     <tr>
                       <td className="order-id">#ORD-2851</td>
                       <td className="customer-name">Suresh Kumar</td>
                       <td>Mar 21, 2026</td>
                       <td>₹4,799</td>
                       <td><span className="status-pill status-shipped">Shipped</span></td>
                     </tr>
                   </tbody>
                 </table>
              </div>
           </div>
        </div>
     </div>
  )
}

function ProductManagement() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/tables/products').then(r => r.json()).then(d => setProducts(d.data || []))
  }, [])

  return (
    <div className="products-view">
       <div className="view-header">
          <h1 className="page-title">Manage Products</h1>
          <button className="btn-primary">
             <span className="material-symbols-outlined">add</span>
             Add Product
          </button>
       </div>
       
       <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                       <img src={p.image_url} alt="" className="table-img" />
                       <span className="table-product-name">{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>₹{p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`status-pill ${p.stock > 0 ? 'status-paid' : 'status-failed'}`}>
                      {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                       <button className="action-btn edit" title="Edit"><span className="material-symbols-outlined">edit</span></button>
                       <button className="action-btn delete" title="Delete"><span className="material-symbols-outlined">delete</span></button>
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
