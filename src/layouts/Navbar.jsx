import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname, location.search])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { name: 'Luggage', path: '/products?cat=Luggage' },
    { name: 'Backpacks', path: '/products?cat=Backpack' },
    { name: 'Duffle', path: '/products?sub=Duffle' },
    { name: 'Accessories', path: '/products?cat=Accessories' },
    { name: 'Premium', path: '/premium' }
  ]

  return (
    <>
      <motion.header
        className={`navbar-atelier ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="container navbar-inner">
          <div className="nav-left">
            <Link to="/" className="atelier-logo">
              PRIORITY<span className="gold-dot">.</span>
            </Link>
          </div>

          <nav className="nav-center">
            <ul className="nav-list">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`nav-item ${location.search.includes(link.name) ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-right">
            <div className="nav-icon-group">
              <button className="icon-btn" onClick={() => navigate('/products')}>
                <span className="material-symbols-outlined">search</span>
              </button>

              <Link to="/account" className="icon-btn">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>

              <div className="cart-btn-vessel">
                <button className="icon-btn" onClick={() => setIsOpen(true)}>
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                </button>
              </div>

              {/* Hamburger — mobile only */}
              <button
                className="icon-btn hamburger-btn"
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Menu"
              >
                <span className="material-symbols-outlined">
                  {menuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-menu-header">
                <span className="atelier-logo">PRIORITY<span className="gold-dot">.</span></span>
                <button className="icon-btn" onClick={() => setMenuOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <ul className="mobile-nav-list">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="mobile-nav-item">
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li><Link to="/account" className="mobile-nav-item">My Account</Link></li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

