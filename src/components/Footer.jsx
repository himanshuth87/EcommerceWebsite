import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span className="footer-logo-text">PRIORITY</span>
        
        <div className="footer-links">
          <div className="footer-col">
            <h4>Sustainability</h4>
            <Link to="#">Our Impact</Link>
            <Link to="#">Econyl®</Link>
            <Link to="#">Circularity</Link>
          </div>
          <div className="footer-col">
            <h4>Care Instructions</h4>
            <Link to="#">Leather Care</Link>
            <Link to="#">Hardware Maintenance</Link>
            <Link to="#">Repairs</Link>
          </div>
          <div className="footer-col">
            <h4>Boutiques</h4>
            <Link to="#">Florence</Link>
            <Link to="#">New York</Link>
            <Link to="#">Paris</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Accessibility</Link>
          </div>
        </div>

        <div className="footer-social">
          <a href="#" className="social-icon">
            <span className="material-symbols-outlined">public</span>
          </a>
          <a href="#" className="social-icon">
            <span className="material-symbols-outlined">camera</span>
          </a>
          <a href="#" className="social-icon">
            <span className="material-symbols-outlined">mail</span>
          </a>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} PRIORITY LEATHERWORKS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  )
}
