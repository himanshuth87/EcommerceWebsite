import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span className="footer-logo-text">PRIORITY</span>
        
        <div className="footer-links">
          <div className="footer-brand-side">
            <div className="footer-col">
              <h4>OUR BRANDS</h4>
              <span className="brand-logo" style={{ fontWeight: '900', fontSize: '1.25rem' }}>URBAN JUNGLE</span>
              <span className="brand-logo-alt" style={{ fontFamily: 'cursive', fontSize: '1.25rem', color: '#ff4d4d' }}>Genie</span>
              <div className="social-links">
                <a href="#" className="social-icon"><span className="material-symbols-outlined">public</span></a>
                <a href="#" className="social-icon"><span className="material-symbols-outlined">camera</span></a>
                <a href="#" className="social-icon"><span className="material-symbols-outlined">mail</span></a>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>SHOP</h4>
            <Link to="/products?cat=Luggage">Luggage</Link>
            <Link to="/products?cat=Backpacks">Backpacks</Link>
            <Link to="/about">Blog</Link>
            <Link to="/about">Store Locator</Link>
          </div>

          <div className="footer-col">
            <h4>POLICIES</h4>
            <Link to="#">Privacy policy</Link>
            <Link to="#">Returns & Exchanges</Link>
            <Link to="#">Shipping policy</Link>
            <Link to="#">Terms & Conditions</Link>
            <Link to="#">Warranty policy</Link>
            <Link to="#">Warranty Registration</Link>
          </div>

          <div className="footer-col">
            <h4>SUPPORT</h4>
            <Link to="/about">About Us</Link>
            <Link to="/about">Contact us</Link>
            <Link to="/account">Account</Link>
            <Link to="/about">Investor Relations</Link>
            <Link to="#">Return Request</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} PRIORITY LEATHERWORKS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  )
}
