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
                <li>
                  <Link to="/products" className="nav-link">SHOP</Link>
                </li>
                <li>
                  <Link to="/premium" className="nav-link premium-nav-link">PREMIUM</Link>
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
            <button className="panel-close" onClick={() => setPanelOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="panel-content">
            <div className="panel-group">
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
