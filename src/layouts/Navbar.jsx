import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const NAV_LINKS = [
  {
    name: 'Backpacks',
    path: '/products?cat=Backpack',
    children: [
      { name: 'Laptop / Business', path: '/products?cat=Backpack&sub=Laptop' },
      { name: 'School', path: '/products?cat=Backpack&sub=School' },
      { name: 'College', path: '/products?cat=Backpack&sub=College' },
      { name: 'Trekking', path: '/products?cat=Backpack&sub=Trekking' },
      { name: 'Overnight', path: '/products?cat=Backpack&sub=Overnight' },
    ],
  },
  {
    name: 'Luggage',
    path: '/products?cat=Luggage',
    children: [
      { name: 'Soft Luggage', path: '/products?cat=Luggage&sub=Soft Luggage' },
      { name: 'Hard Luggage', path: '/products?cat=Luggage&sub=Hard Luggage' },
    ],
  },
  {
    name: 'Accessories',
    path: '/products?cat=Accessories',
    children: [
      { name: 'Duffle', path: '/products?cat=Accessories&sub=Duffle' },
      { name: 'Side Bags', path: '/products?cat=Accessories&sub=Side Bags' },
      { name: 'Shopping Bag', path: '/products?cat=Accessories&sub=Shopping Bag' },
      { name: 'Lunch Bags', path: '/products?cat=Accessories&sub=Lunch Bags' },
      { name: 'Pouches', path: '/products?cat=Accessories&sub=Pouches' },
    ],
  },
  { name: 'Kids', path: '/products?cat=Kids' },
  { name: 'Premium Luggage', path: '/premium' },
]

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setOpenDropdown(null) }, [location.pathname, location.search])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.header
        className={`navbar-atelier ${scrolled ? 'scrolled' : ''} ${isHome ? 'navbar-campus' : ''}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="container navbar-inner">
          <div className="nav-left">
            <Link to="/" className="atelier-logo">
              <span className="logo-mark" aria-hidden="true" />
              PRIORITY
            </Link>
          </div>

          <nav className="nav-center">
            <ul className="nav-list">
              {NAV_LINKS.map(link => (
                <li
                  key={link.name}
                  className={`nav-li ${link.children ? 'has-children' : ''}`}
                  onMouseEnter={() => link.children && setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={link.path}
                    className={`nav-item ${location.search.includes(link.name) ? 'active' : ''}`}
                  >
                    {link.name}
                    {link.children && <span className="caret">▾</span>}
                  </Link>
                  {link.children && (
                    <AnimatePresence>
                      {openDropdown === link.name && (
                        <motion.div
                          className="nav-dropdown"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.children.map(c => (
                            <Link key={c.name} to={c.path} className="nav-dropdown-item">
                              {c.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-right">
            <div className="nav-icon-group">
              <button className="icon-btn" onClick={() => navigate('/products')} aria-label="Search">
                <span className="material-symbols-outlined">search</span>
              </button>

              <Link to="/account" className="icon-btn" aria-label="Account">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>

              <div className="cart-btn-vessel">
                <button className="icon-btn" onClick={() => setIsOpen(true)} aria-label="Cart">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                </button>
              </div>

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
                <span className="atelier-logo">
                  <span className="logo-mark" aria-hidden="true" />
                  PRIORITY
                </span>
                <button className="icon-btn" onClick={() => setMenuOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <ul className="mobile-nav-list">
                {NAV_LINKS.map(link => (
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
