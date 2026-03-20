import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <img src="/assets/Priority%20Logo-02.png" alt="Priority Bags" className="footer-logo"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span className="footer-logo-text" style={{display:'none'}}>PRIORITY</span>
          <p className="footer-tagline">
            Engineered for excellence,<br />designed for the elite traveller.
          </p>
          <div className="footer-social">
            {['Instagram', 'Facebook', 'Twitter'].map(s => (
              <a key={s} href="#" className="social-btn" aria-label={s}>
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/products?cat=Cabin+Luggage">Cabin Luggage</Link>
            <Link to="/products?cat=Check-in+Luggage">Check-in Luggage</Link>
            <Link to="/products?cat=Luggage+Sets">Luggage Sets</Link>
            <Link to="/products?cat=Backpacks">Backpacks</Link>
            <Link to="/products?cat=Accessories">Accessories</Link>
            <Link to="/premium">Premium Collection</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Sustainability</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Track Order</a>
            <a href="#">Returns & Exchanges</a>
            <a href="#">Warranty</a>
            <a href="#">FAQ</a>
            <a href="#">Contact Us</a>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>Join the Inner Circle</h4>
          <p>Exclusive offers, early access, and travel insights for our subscribers.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button className="btn btn-gold btn-sm">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <div className="footer-divider" />
        <div className="footer-bottom-row">
          <p className="footer-copy">© {new Date().getFullYear()} Priority Bags. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-payments">
            {['Visa', 'MC', 'UPI', 'Razorpay'].map(p => (
              <span key={p} className="payment-chip">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
