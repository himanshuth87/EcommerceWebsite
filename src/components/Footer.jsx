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
              <Link to="/premium" className="brand-logo" style={{ fontWeight: '900', fontSize: '1.25rem', textDecoration: 'none', color: 'inherit' }}>Traworld</Link>
              <span className="brand-logo-alt" style={{ fontFamily: 'cursive', fontSize: '1.25rem', color: '#ff4d4d' }}>Priority</span>
              
              <div className="footer-subscribe-small">
                <p>Stay Updated</p>
                <form className="footer-news-form" onSubmit={e => e.preventDefault()}>
                  <input type="email" placeholder="Email" />
                  <button type="submit"><span className="material-symbols-outlined">arrow_forward</span></button>
                </form>
              </div>

              <div className="social-links">
                <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">public</span></a>
                <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">camera</span></a>
                <a href="mailto:support@prioritybags.com" className="social-icon"><span className="material-symbols-outlined">mail</span></a>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>SHOP</h4>
            <Link to="/products?cat=Luggage">Luggage</Link>
            <Link to="/products?cat=Backpacks">Backpacks</Link>
            <Link to="/about">Blog</Link>
          </div>

          <div className="footer-col">
            <h4>POLICIES</h4>
            <Link to="/about">Privacy policy</Link>
            <Link to="/about">Returns & Exchanges</Link>
            <Link to="/about">Shipping policy</Link>
            <Link to="/about">Terms & Conditions</Link>
            <Link to="/about">Warranty policy</Link>
            <Link to="/about">Warranty Registration</Link>
          </div>

          <div className="footer-col">
            <h4>SUPPORT</h4>
            <Link to="/about">About Us</Link>
            <Link to="/about">Contact us</Link>
            <Link to="/account">Account</Link>
            <Link to="/about">Our Team</Link>
            <Link to="/about">Return Request</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} PRIORITY Bags. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  )
}
