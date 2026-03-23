import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer-safari">
      <div className="footer-overlay" />
      <div className="footer-bg-img" />
      
      <div className="container footer-content-safari">
        {/* Brand Side */}
        <div className="footer-brand-safari">
          <span className="logo-safari">PRIORITY</span>
          <div className="other-brands">
            <p className="brands-label">OUR OTHER BRANDS</p>
            <div className="brand-logos">
              <span className="brand-placeholder">URBAN JUNGLE</span>
              <span className="brand-placeholder-alt">Genie</span>
            </div>
          </div>
          <div className="social-icons-safari">
            <a href="#" className="social-box"><span className="material-symbols-outlined">public</span></a>
            <a href="#" className="social-box"><span className="material-symbols-outlined">camera</span></a>
            <a href="#" className="social-box"><span className="material-symbols-outlined">play_circle</span></a>
            <a href="#" className="social-box"><span className="material-symbols-outlined">mail</span></a>
          </div>
        </div>

        {/* Links Side */}
        <div className="footer-links-safari">
          <div className="footer-col-safari">
            <h4>SHOP</h4>
            <Link to="/products?cat=Luggage">Luggage</Link>
            <Link to="/products?cat=Backpacks">Backpacks</Link>
            <Link to="/about">Blog</Link>
            <Link to="/about">Store Locator</Link>
          </div>
          <div className="footer-col-safari">
            <h4>POLICIES</h4>
            <Link to="#">Privacy policy</Link>
            <Link to="#">Returns & Exchanges</Link>
            <Link to="#">Shipping policy</Link>
            <Link to="#">Terms & Conditions</Link>
            <Link to="#">Warranty policy</Link>
            <Link to="#">Warranty Registration</Link>
          </div>
          <div className="footer-col-safari">
            <h4>SUPPORT</h4>
            <Link to="/about">About Us</Link>
            <Link to="/about">Contact us</Link>
            <Link to="/account">Account</Link>
            <Link to="/about">Investor Relations</Link>
            <Link to="#">Return Request</Link>
          </div>
        </div>

        {/* Product Image Overlay */}
        <div className="footer-product-img">
          <img src="/assets/Category/Backpack.png" alt="Featured Product" />
        </div>
      </div>

      <div className="footer-bottom-safari">
        <div className="container">
          <p>© {new Date().getFullYear()} Priority Bags. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
