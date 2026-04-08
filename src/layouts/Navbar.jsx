import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { name: 'Luggage', path: '/products?cat=Luggage', icon: 'keyboard_arrow_down' },
    { name: 'Backpacks', path: '/products?cat=Backpack' },
    { name: 'Duffle', path: '/products?sub=Duffle' },
    { name: 'Accessories', path: '/products?cat=Accessories' }
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
                    {link.name} {link.icon && <span className="material-symbols-outlined">{link.icon}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-right">
            <div className="nav-icon-group">
              <button className="icon-btn desktop-only" onClick={() => navigate('/products')}>
                <span className="material-symbols-outlined">search</span>
              </button>
              <button className="icon-btn desktop-only" onClick={() => navigate('/about')}>
                <span className="material-symbols-outlined">location_on</span>
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
              <button className="icon-btn mobile-only" onClick={() => setPanelOpen(true)}>
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {panelOpen && (
          <motion.div 
            className="panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPanelOpen(false)}
          >
            <motion.div 
              className="panel-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <button className="icon-btn" onClick={() => setPanelOpen(false)}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>close</span>
                </button>
              </div>
              <div className="panel-links">
                {navLinks.map(l => (
                  <Link key={l.name} to={l.path} className="panel-link" onClick={() => setPanelOpen(false)}>{l.name}</Link>
                ))}
                <Link to="/account" className="panel-link" onClick={() => setPanelOpen(false)}>My Account</Link>
                {user?.role === 'admin' && (
                   <Link to="/admin" className="panel-link admin-link" onClick={() => setPanelOpen(false)}>Admin Panel</Link>
                )}
                {user ? (
                   <button onClick={() => { logout(); setPanelOpen(false); navigate('/') }} className="panel-link">Logout</button>
                ) : (
                   <Link to="/login" className="panel-link" onClick={() => setPanelOpen(false)}>Login / Register</Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

