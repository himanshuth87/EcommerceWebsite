import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        {/* ── VALUE PROPS ── */}
        <div className="footer-value-props">
          <p className="props-label">Know The Reason</p>
          <h2 className="props-title">WHY TO BUY FROM PRIORITY</h2>
          <div className="props-underline"></div>
          
          <div className="props-grid">
            <div className="prop-item">
              <span className="material-symbols-outlined prop-icon">local_shipping</span>
              <h4>Free Shipping</h4>
              <p>Prompt shipping across India.</p>
            </div>
            <div className="prop-item">
              <span className="material-symbols-outlined prop-icon">lock</span>
              <h4>Secure Payment</h4>
              <p>Ensuring top-tier payment security.</p>
            </div>
            <div className="prop-item">
              <span className="material-symbols-outlined prop-icon">verified_user</span>
              <h4>Brand Warranty</h4>
              <p>All products are backed by international warranty.</p>
            </div>
            <div className="prop-item">
              <span className="material-symbols-outlined prop-icon">package_2</span>
              <h4>Genuine Products</h4>
              <p>Subjected to rigorous 8-level testing.</p>
            </div>
          </div>
        </div>

        {/* ── LINKS COLUMNS ── */}
        <div className="footer-links-grid">
          <div className="footer-link-col">
            <h3>OTHER LINKS</h3>
            <Link to="/about">About Us</Link>
            <Link to="/about">Store Locator</Link>
            <Link to="/about">Contact Us</Link>
            <Link to="/about">FAQ</Link>
          </div>
          <div className="footer-link-col">
            <h3>POLICIES</h3>
            <Link to="/about">Privacy Policy</Link>
            <Link to="/about">Cancellation, Return & Refund Policy</Link>
            <Link to="/about">Return & Exchange</Link>
            <Link to="/about">Terms of offers/promotions</Link>
            <Link to="/about">VIP Smart Tag Offer</Link>
            <Link to="/about">Warranty Terms and Conditions</Link>
          </div>
          <div className="footer-link-col">
            <h3>SUPPORT</h3>
            <Link to="/about">Enquiry</Link>
            <Link to="/about">Register Product</Link>
            <Link to="/about">Product Utility</Link>
          </div>
        </div>

        {/* ── SOCIALS ── */}
        <div className="footer-social-row">
          <a href="#" className="soc-icon"><i className="fa-brands fa-facebook"></i></a>
          <a href="#" className="soc-icon"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="soc-icon"><i className="fa-brands fa-youtube"></i></a>
          <a href="#" className="soc-icon"><i className="fa-brands fa-x-twitter"></i></a>
          <a href="#" className="soc-icon"><i className="fa-brands fa-whatsapp"></i></a>
        </div>

        {/* ── CONTACT ── */}
        <div className="footer-contact-info">
          <p>
            For Orders and Delivery: <span>info@prioritybags.com</span> | 
            Call Us: <span>022-41724444</span>
          </p>
        </div>

        {/* ── COPYRIGHT ── */}
        <div className="footer-copyright-box">
          <p>© 2026 HSCVPL. All rights reserved | Terms & Conditions | Privacy Policy</p>
          <p className="footer-time">(Monday To Sunday, 8.00 AM To 8 PM)</p>
        </div>

      </div>
    </footer>
  )
}