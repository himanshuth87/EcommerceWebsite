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
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src="/assets/Priority%20Logo-02.png" alt="Priority Bags" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span className="logo-text">PRIORITY</span>
        </Link>

        <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
          <div className="nav-item" onMouseEnter={() => setMegaOpen('luggage')} onMouseLeave={() => setMegaOpen(null)}>
            <Link to="/products?cat=Cabin+Luggage" className="nav-link">Luggage <span className="chevron">›</span></Link>
            {megaOpen === 'luggage' && (
              <div className="mega-menu">
                <Link to="/products?cat=Cabin+Luggage" className="mega-item" onClick={() => setMegaOpen(null)}>
                  <img src="/assets/Category/Travelling%20Bag.png" alt="Cabin" />
                  <span>Cabin</span>
                </Link>
                <Link to="/products?cat=Check-in+Luggage" className="mega-item" onClick={() => setMegaOpen(null)}>
                  <img src="/assets/Category/Travelling%20Bag.png" alt="Check-in" />
                  <span>Check-in</span>
                </Link>
                <Link to="/products?cat=Luggage+Sets" className="mega-item" onClick={() => setMegaOpen(null)}>
                  <img src="/assets/Category/Travelling%20Bag.png" alt="Sets" />
                  <span>Sets</span>
                </Link>
              </div>
            )}
          </div>

          <div className="nav-item" onMouseEnter={() => setMegaOpen('backpacks')} onMouseLeave={() => setMegaOpen(null)}>
            <Link to="/products?cat=Backpacks" className="nav-link">Backpacks <span className="chevron">›</span></Link>
            {megaOpen === 'backpacks' && (
              <div className="mega-menu">
                <Link to="/products?cat=Backpacks" className="mega-item" onClick={() => setMegaOpen(null)}>
                  <img src="/assets/Category/Backpack.png" alt="Backpacks" />
                  <span>All Backpacks</span>
                </Link>
              </div>
            )}
          </div>

          <div className="nav-item" onMouseEnter={() => setMegaOpen('acc')} onMouseLeave={() => setMegaOpen(null)}>
            <Link to="/products?cat=Accessories" className="nav-link">Accessories <span className="chevron">›</span></Link>
            {megaOpen === 'acc' && (
              <div className="mega-menu">
                <Link to="/products?cat=Accessories" className="mega-item" onClick={() => setMegaOpen(null)}>
                  <img src="/assets/Category/Accessories.png" alt="Accessories" />
                  <span>All Accessories</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/premium" className="nav-link nav-gold">Premium ✦</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        <div className="navbar-actions">
          {user ? (
            <div className="nav-user">
              <Link to="/account" className="nav-icon-btn" title="Account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
          )}

          <button className="nav-icon-btn cart-btn" onClick={() => setIsOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
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
