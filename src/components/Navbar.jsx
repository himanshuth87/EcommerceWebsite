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
  const [megaOpen, setMegaOpen] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <div className="flex items-center gap-12">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">PRIORITY</span>
          </Link>
          
          <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
            <Link to="/products" className="nav-link">New Arrivals</Link>
            <div 
              className="nav-item-wrap" 
              onMouseEnter={() => setMegaOpen('collections')} 
              onMouseLeave={() => setMegaOpen(null)}
            >
              <Link to="/products" className="nav-link">Collections</Link>
              {megaOpen === 'collections' && (
                <div className="mega-menu">
                  <div className="container flex justify-center gap-16">
                    <Link to="/products?cat=Cabin+Luggage" className="mega-item" onClick={() => setMegaOpen(null)}>
                      <img src="/assets/Category/Travelling%20Bag.png" alt="Cabin" />
                      <span>Cabin</span>
                    </Link>
                    <Link to="/products?cat=Check-in+Luggage" className="mega-item" onClick={() => setMegaOpen(null)}>
                      <img src="/assets/Category/Travelling%20Bag.png" alt="Check-in" />
                      <span>Check-in</span>
                    </Link>
                    <Link to="/products?cat=Backpacks" className="mega-item" onClick={() => setMegaOpen(null)}>
                      <img src="/assets/Category/Backpack.png" alt="Backpacks" />
                      <span>Backpacks</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/about" className="nav-link">Our Heritage</Link>
          </nav>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/account" className="nav-icon-btn" title="Account">
                <span className="material-symbols-outlined">person</span>
              </Link>
              <button onClick={handleLogout} className="btn-bespoke" style={{ padding: '8px 16px', fontSize: '0.625rem' }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="nav-icon-btn">
              <span className="material-symbols-outlined">login</span>
            </Link>
          )}

          <button className="nav-icon-btn cart-btn" onClick={() => setIsOpen(true)}>
            <span className="material-symbols-outlined">shopping_bag</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  )
}
