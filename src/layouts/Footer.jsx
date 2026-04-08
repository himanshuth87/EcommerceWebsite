import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-atelier">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="atelier-footer-logo editorial-header">
              PRIORITY<span className="gold-gradient-text">.</span>
            </Link>
            <p className="footer-tagline">
              The Art of Global Odyssey. <br />
            </p>
            <div className="footer-socials">
              {['facebook', 'instagram', 'youtube', 'x-twitter'].map(social => (
                <a key={social} href={`#${social}`} className="social-link glass">
                  <i className={`fa-brands fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-nav-groups">
            <div className="footer-nav-col">
              <h4 className="label-sm gold-gradient-text">Collection</h4>
              <Link to="/products?badge=New">New Arrivals</Link>
              <Link to="/products?badge=Bestseller">Bestsellers</Link>
              <Link to="/premium">Signature Series</Link>
              <Link to="/products">All Products</Link>
            </div>
            <div className="footer-nav-col">
              <h4 className="label-sm gold-gradient-text">Company</h4>
              <Link to="/about">Our Legacy</Link>
              <Link to="/about">Craftsmanship</Link>
              <Link to="/about">Sustainability</Link>
              <Link to="/about">Careers</Link>
            </div>
            <div className="footer-nav-col">
              <h4 className="label-sm gold-gradient-text">Support</h4>
              <Link to="/about">Order Status</Link>
              <Link to="/about">Warranty & Repairs</Link>
              <Link to="/about">Return Policy</Link>
              <Link to="/about">Contact Us</Link>
            </div>
          </div>
        </div>

        <div className="footer-trust">
          <div className="trust-vessel glass">
            <div className="trust-item">
              <span className="material-symbols-outlined">local_shipping</span>
              <div>
              </div>
            </div>
            <div className="trust-item">
              <span className="material-symbols-outlined">verified_user</span>
              <div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom label-xs">
          <div className="legal-links">
            <Link to="/about">Privacy</Link>
            <Link to="/about">Terms</Link>
            <Link to="/about">Accessibility</Link>
          </div>
          <p className="copyright">© {year} Priority Bags. HSCVPL Group.</p>
        </div>
      </div>
    </footer>
  )
}