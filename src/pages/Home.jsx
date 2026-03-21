import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { formatCurrency } from '../hooks/useApi'
import './Home.css'

const HERO_SLIDES = [
  {
    title: 'Travel in',
    titleAccent: 'Absolute Luxury',
    subtitle: 'Hardshell luggage engineered for the modern elite. TSA-approved, lifetime warranty.',
    cta: 'Shop Collection',
    href: '/products',
    bg: '/assets/Creatives/hero-main.jpg',
  },
  {
    title: 'The Premium',
    titleAccent: 'Collection',
    subtitle: 'Exclusive designs for discerning travellers. Limited edition pieces crafted for prestige.',
    cta: 'View Premium',
    href: '/premium',
    bg: '/assets/Creatives/hero-1.jpg',
  },
  {
    title: 'Built for',
    titleAccent: 'Every Journey',
    subtitle: 'From cabin to check-in, explore our full range of travel essentials.',
    cta: 'Explore All',
    href: '/products',
    bg: '/assets/Creatives/hero-2.jpg',
  },
]





export default function Home() {
  const [slide, setSlide] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsSold, setProductsSold] = useState(54200)

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 6000)
    const sellTimer = setInterval(() => setProductsSold(s => s + 100), 60000)
    return () => { clearInterval(timer); clearInterval(sellTimer) }
  }, [])

  useEffect(() => {
    fetch('/tables/products')
      .then(r => r.json())
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const bestsellers = products.filter(p => p.badge === 'Bestseller' || p.is_bestseller).slice(0, 8)

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`hero-slide ${i === slide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${s.bg})` }}
          >
            <div className="hero-overlay" />
            <div className="container hero-content">
              {/* Text removed per user request */}
              {/* Buttons removed per user request */}
            </div>
          </div>
        ))}

        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hero-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>

        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>



      {/* ── PRODUCTS ── */}
      <section className="products-section section-pad reveal">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Best<span>sellers</span></h2>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">View All →</Link>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 380, borderRadius: 16 }} />)}
            </div>
          ) : (
            <div className="products-grid">
              {bestsellers.map((p, i) => (
                <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* ── TRUST STRIP ── */}
      <section className="trust-strip section-pad reveal" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="trust-inner">
            <div className="trust-stat hover-lift"><span className="trust-num">{productsSold.toLocaleString()}+</span><span className="trust-label">Happy Travellers</span></div>
            <div className="trust-divider" />
            <div className="trust-stat hover-lift"><span className="trust-num">4.8★</span><span className="trust-label">Average Rating</span></div>
            <div className="trust-divider" />
            <div className="trust-stat hover-lift"><span className="trust-num">15+</span><span className="trust-label">Countries Shipped</span></div>
            <div className="trust-divider" />
            <div className="trust-stat hover-lift"><span className="trust-num">Lifetime</span><span className="trust-label">Warranty</span></div>
          </div>
        </div>
      </section>
    </main>
  )
}
