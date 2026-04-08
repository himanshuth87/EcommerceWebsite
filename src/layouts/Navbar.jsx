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
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <motion.header 
        className={`navbar-atelier ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="container navbar-inner">
          <div className="nav-left">
            <Link to="/" className="atelier-logo">
              PRIORITY<span className="gold-dot">.</span>
            </Link>
          </div>
          
          <nav className="nav-center">
            <ul className="nav-list">
              <li><Link to="/products" className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}>Collection</Link></li>
              <li><Link to="/premium" className={`nav-item premium-gold ${location.pathname === '/premium' ? 'active' : ''}`}>Signature</Link></li>
              <li><Link to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>Legacy</Link></li>
            </ul>
          </nav>

          <div className="nav-right">
            <div className="search-box desktop-only">
              <span className="material-symbols-outlined">search</span>
              <input 
                type="text" 
                placeholder="SEARCH" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            
            <button className="icon-btn" onClick={() => setIsOpen(true)}>
              <span className="material-symbols-outlined">shopping_bag</span>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </button>

            <button className="icon-btn mobile-only" onClick={() => setPanelOpen(true)}>
              <span className="material-symbols-outlined">menu_open</span>
            </button>
            
            <Link to="/account" className="icon-btn desktop-only">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '60px' }}>
                <button className="icon-btn" onClick={() => setPanelOpen(false)}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>close</span>
                </button>
              </div>
              <div className="panel-links">
                <Link to="/products" className="panel-link" onClick={() => setPanelOpen(false)}>Collection</Link>
                <Link to="/premium" className="panel-link" onClick={() => setPanelOpen(false)}>Signature Line</Link>
                <Link to="/account" className="panel-link" onClick={() => setPanelOpen(false)}>Account</Link>
                {user?.role === 'admin' && (
                   <Link to="/admin" className="panel-link admin-link" onClick={() => setPanelOpen(false)}>Control Center</Link>
                )}
                {user ? (
                   <button onClick={() => { logout(); setPanelOpen(false); navigate('/') }} className="panel-link">Sign Out</button>
                ) : (
                   <Link to="/login" className="panel-link" onClick={() => setPanelOpen(false)}>Identify</Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

