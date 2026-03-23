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
          {/* LEFT: LOGO */}
          <div className="nav-left">
            <Link to="/" className="navbar-logo-s">
              <span className="logo-text">PRIORITY</span>
            </Link>
          </div>

          {/* CENTER: SEARCH BAR (as requested) */}
          <div className="nav-center-search">
            <div className="nav-search-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                placeholder="Search for luggage, backpacks and more..." 
                className="nav-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* RIGHT: CATEGORIES & PANEL TRIGGER */}
          <div className="nav-right-actions">
            <nav className="nav-links-desktop">
              <ul className="nav-links-list">
                <li className="has-mega">
                  <Link to="/products?cat=Luggage" className="nav-link">Trolley Bags</Link>
                  <div className="mega-menu">
                    <div className="mega-col">
                      <h5>HARD LUGGAGE</h5>
                      <Link to="/products?sub=Hardside">Hardside Trolleys</Link>
                      <Link to="/products?sub=Cabin">Cabin Luggage</Link>
                      <Link to="/products?sub=Check-in">Check-in Luggage</Link>
                    </div>
                    <div className="mega-col">
                      <h5>SOFT LUGGAGE</h5>
                      <Link to="/products?sub=Softside">Softside Trolleys</Link>
                      <Link to="/products?sub=Travel">Travel Duffels</Link>
                    </div>
                  </div>
                </li>
                <li className="has-mega">
                  <Link to="/products?cat=Backpacks" className="nav-link">Backpacks</Link>
                  <div className="mega-menu">
                    <div className="mega-col">
                      <h5>LAPTOP BAGS</h5>
                      <Link to="/products?sub=Laptop">Professional Laptop</Link>
                      <Link to="/products?sub=Sleek">Sleek Laptop</Link>
                    </div>
                    <div className="mega-col">
                      <h5>CASUAL</h5>
                      <Link to="/products?sub=Daypack">Daypacks</Link>
                      <Link to="/products?sub=College">College Backpacks</Link>
                    </div>
                  </div>
                </li>
                <li><Link to="/premium" className="nav-link">Premium ✦</Link></li>
              </ul>
            </nav>

            <button 
              className="panel-trigger"
              onClick={() => setPanelOpen(true)}
              aria-label="Open Panel"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* SIDE PANEL (DRAWER) */}
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
              <h4>PERSONAL</h4>
              <Link to="/account" onClick={() => setPanelOpen(false)} className="panel-item">
                <span className="material-symbols-outlined">account_circle</span>
                My Account
              </Link>
              <Link to="/wishlist" onClick={() => setPanelOpen(false)} className="panel-item">
                <span className="material-symbols-outlined">favorite</span>
                Wishlist
              </Link>
              <button 
                onClick={() => { setIsOpen(true); setPanelOpen(false) }} 
                className="panel-item"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Cart ({totalItems})
              </button>
            </div>

            <div className="panel-group">
              <h4>APPEARANCE</h4>
              <div className="theme-switcher">
                <span className="theme-label">Theme: <strong>{theme === 'dark' ? 'Dark' : 'Light'}</strong></span>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                  <span className="material-symbols-outlined">
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                  </span>
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>

            {user && (
              <div className="panel-footer">
                <button onClick={handleLogout} className="panel-item logout-red">
                  <span className="material-symbols-outlined">logout</span>
                  Sign Out
                </button>
              </div>
            )}
            {!user && (
              <div className="panel-footer">
                <Link to="/login" onClick={() => setPanelOpen(false)} className="panel-item">
                  <span className="material-symbols-outlined">login</span>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
