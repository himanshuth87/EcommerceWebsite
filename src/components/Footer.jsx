import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        {/* ── WHY TO BUY SECTION ── */}
        <div className="footer-value-props">
          <p className="props-label">Know The Reason</p>
          <h2 className="props-title">WHY TO BUY FROM VIP</h2>
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

        {/* ── ACCORDION LINKS ── */}
        <div className="footer-accordions">
          <div className="acc-row">
            <span>QUICK LINKS</span>
            <span className="material-symbols-outlined">expand_more</span>
          </div>
          <div className="acc-row">
            <span>CONSUMER</span>
            <span className="material-symbols-outlined">expand_more</span>
          </div>
          <div className="acc-row">
            <span>OFFICE USE</span>
            <span className="material-symbols-outlined">expand_more</span>
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
            For Orders and Delivery: <span>support@vipbags.com</span> | 
            For Product and After Sales Service: <span>feedback@vipbags.com</span> | 
            Call Us: <span>022-41724444</span>
          </p>
        </div>

        {/* ── COPYRIGHT ── */}
        <div className="footer-copyright-box">
          <p>© 2026 VIP. All rights reserved | Terms & Conditions | Privacy Policy</p>
          <p className="footer-time">(Monday To Sunday, 8.00 AM To 8 PM)</p>
        </div>

      </div>
    </footer>
  )
}
