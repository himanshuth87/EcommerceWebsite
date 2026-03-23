import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className={`navbar-gucci ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid navbar-inner">
        {/* Left spacer for centering logo */}
        <div className="nav-col-left hidden-mobile" />

        <div className="nav-col-center">
          <Link to="/" className="navbar-logo-large">
            <span className="logo-text-gucci">PRIORITY</span>
          </Link>
        </div>

        <div className="nav-col-right">
          <div className="navbar-actions-gucci">
            <button className="nav-icon-btn-gucci search-btn">
              <span className="material-symbols-outlined">search</span>
            </button>
            
            <button className="nav-icon-btn-gucci cart-btn" onClick={() => setIsOpen(true)}>
              <span className="material-symbols-outlined">shopping_bag</span>
              {totalItems > 0 && <span className="cart-badge-gucci">{totalItems}</span>}
            </button>

            {user ? (
              <Link to="/account" className="nav-icon-btn-gucci hidden-mobile">
                <span className="material-symbols-outlined">person</span>
              </Link>
            ) : (
              <Link to="/login" className="nav-icon-btn-gucci hidden-mobile">
                <span className="material-symbols-outlined">login</span>
              </Link>
            )}

            <button className="menu-toggle-gucci" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="hamburger-gucci">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="menu-label-gucci">MENU</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Menu Overlay */}
      <div className={`mega-menu-gucci ${menuOpen ? 'open' : ''}`}>
        <button className="menu-close-btn" onClick={() => setMenuOpen(false)}>
          <span className="material-symbols-outlined">close</span>
        </button>
        <nav className="mega-nav-links">
          <Link to="/products" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Collections</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>Our Heritage</Link>
          <Link to="/premium" onClick={() => setMenuOpen(false)}>Premium ✦</Link>
          {user && <button onClick={handleLogout} className="logout-link-gucci">Logout</button>}
        </nav>
      </div>
    </header>
  )
}
