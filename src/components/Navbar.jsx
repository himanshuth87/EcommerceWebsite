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
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setAccountOpen(false)
    navigate('/')
  }

  return (
    <header className={`navbar-safari ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid navbar-main">
        <div className="nav-left">
          <Link to="/" className="navbar-logo-s">
            <span className="logo-text">PRIORITY</span>
          </Link>
        </div>

        <nav className="nav-center">
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
                <div className="mega-col">
                  <h5>SETS</h5>
                  <Link to="/products?sub=Sets">Luggage Sets</Link>
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
            <li className="has-mega">
              <Link to="/products?cat=Accessories" className="nav-link">Accessories</Link>
              <div className="mega-menu">
                <div className="mega-col">
                  <h5>TRAVEL ESSENTIALS</h5>
                  <Link to="/products?sub=Locks">Luggage Locks</Link>
                  <Link to="/products?sub=Covers">Suitcase Covers</Link>
                </div>
                <div className="mega-col">
                  <h5>HANDCRAFTED</h5>
                  <Link to="/products?sub=Wallets">Leather Wallets</Link>
                  <Link to="/products?sub=Belts">Premium Belts</Link>
                </div>
              </div>
            </li>
            <li><Link to="/premium" className="nav-link">Premium ✦</Link></li>
          </ul>
        </nav>

        <div className="nav-right">
          <div className="account-wrapper">
            <button 
              className="account-trigger"
              onClick={() => setAccountOpen(!accountOpen)}
            >
              <span className="material-symbols-outlined">person</span>
              <span className="account-label">{user ? 'MY ACCOUNT' : 'LOGIN'}</span>
              <span className="material-symbols-outlined expand-icon">expand_more</span>
            </button>

            {accountOpen && (
              <div className="account-dropdown">
                {/* Search inside account per request */}
                <div className="dropdown-search">
                  <input type="text" placeholder="Search products..." className="drop-search-input" />
                  <span className="material-symbols-outlined">search</span>
                </div>

                <Link to="/account" onClick={() => setAccountOpen(false)} className="drop-item">
                  <span className="material-symbols-outlined">account_circle</span>
                  Profile
                </Link>

                {/* Cart inside account per request */}
                <button 
                  onClick={() => { setIsOpen(true); setAccountOpen(false) }} 
                  className="drop-item"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Cart ({totalItems})
                </button>

                {user && (
                  <>
                    <hr />
                    <button onClick={handleLogout} className="drop-item logout-red">
                      <span className="material-symbols-outlined">logout</span>
                      Log out
                    </button>
                  </>
                )}
                {!user && (
                  <Link to="/login" onClick={() => setAccountOpen(false)} className="drop-item">
                    <span className="material-symbols-outlined">login</span>
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
