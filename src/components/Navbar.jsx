import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setPanelOpen(false)
    navigate('/')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header className={`navbar-safari ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-fluid navbar-main">
          <div className="nav-col-left">
            <Link to="/" className="navbar-logo-s">
              <span className logo-text>PRIORITY</span>
            </Link>
          </div>
          
          <div className="nav-col-center">
            <nav className="nav-links-desktop">
              <ul className="nav-links-list">
                <li className="has-mega">
                  <Link to="/products?cat=Luggage" className="nav-link">Luggage</Link>
                  <div className="mega-menu">
                    <div className="mega-col">
                      <h5>COLLECTIONS</h5>
                      <Link to="/products?cat=Luggage&sub=Hard Luggage">Hard Luggage</Link>
                      <Link to="/products?cat=Luggage&sub=Duffle">Travel Duffle</Link>
                      <Link to="/products?cat=Luggage&sub=Trekking">Trekking Bags</Link>
                    </div>
                  </div>
                </li>
                <li className="has-mega">
                  <Link to="/products?cat=Backpack" className="nav-link">Backpacks</Link>
                  <div className="mega-menu">
                    <div className="mega-col">
                      <h5>CATEGORIES</h5>
                      <Link to="/products?cat=Backpack&sub=School">School Bags</Link>
                      <Link to="/products?cat=Backpack&sub=College">College Backpacks</Link>
                      <Link to="/products?cat=Backpack&sub=Laptop">Laptop Professionals</Link>
                    </div>
                  </div>
                </li>
                <li className="has-mega">
                  <Link to="/products?cat=Accessories" className="nav-link">Accessories</Link>
                  <div className="mega-menu">
                    <div className="mega-col">
                      <h5>ESSENTIALS</h5>
                      <Link to="/products?cat=Accessories&sub=Pouches">Pouches</Link>
                      <Link to="/products?cat=Accessories&sub=Lunch Bags">Lunch Bags</Link>
                      <Link to="/products?cat=Accessories&sub=Shopping Bag">Shopping Bags</Link>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          <div className="nav-col-right">
            <div className="nav-search-wrapper small-search">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" placeholder="Search..." 
                className="nav-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <button className="panel-trigger" onClick={() => setPanelOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      <div className={`side-panel-overlay ${panelOpen ? 'active' : ''}`} onClick={() => setPanelOpen(false)}>
        <div className={`side-panel ${panelOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="panel-header">
            <h3>Menu</h3>
            <button className="panel-close" onClick={() => setPanelOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="panel-content">
            <div className="panel-group">
              <h4>COLLECTIONS</h4>
              <Link to="/products?cat=Luggage" onClick={() => setPanelOpen(false)} className="panel-item">Luggage</Link>
              <Link to="/products?cat=Backpack" onClick={() => setPanelOpen(false)} className="panel-item">Backpacks</Link>
              <Link to="/products?cat=Accessories" onClick={() => setPanelOpen(false)} className="panel-item">Accessories</Link>
            </div>
            <div className="panel-group" style={{ marginTop: '24px' }}>
              <h4>PERSONAL</h4>
              <Link to="/account" onClick={() => setPanelOpen(false)} className="panel-item">
                <span className="material-symbols-outlined">account_circle</span> My Account
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setPanelOpen(false)} className="panel-item admin-red">
                  <span className="material-symbols-outlined">settings</span> Admin Panel
                </Link>
              )}
              <button onClick={() => { setIsOpen(true); setPanelOpen(false) }} className="panel-item">
                <span className="material-symbols-outlined">shopping_bag</span> Cart ({totalItems})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
