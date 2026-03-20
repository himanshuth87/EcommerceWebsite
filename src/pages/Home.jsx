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
    bg: '/assets/Creatives/Hero%201.jpg',
  },
  {
    title: 'The Premium',
    titleAccent: 'Collection',
    subtitle: 'Exclusive designs for discerning travellers. Limited edition pieces crafted for prestige.',
    cta: 'View Premium',
    href: '/premium',
    bg: '/assets/Creatives/1920%20%C3%97%201080%20px%20(1).jpg',
  },
  {
    title: 'Built for',
    titleAccent: 'Every Journey',
    subtitle: 'From cabin to check-in, explore our full range of travel essentials.',
    cta: 'Explore All',
    href: '/products',
    bg: '/assets/Creatives/1920%20%C3%97%201080%20px%20(2).jpg',
  },
]

const CATEGORIES = [
  { name: 'Cabin Luggage', img: '/assets/Category/Travelling%20Bag.png', href: '/products?cat=Cabin+Luggage', count: '3 styles' },
  { name: 'Check-in Luggage', img: '/assets/Category/Travelling%20Bag.png', href: '/products?cat=Check-in+Luggage', count: '2 styles' },
  { name: 'Backpacks', img: '/assets/Category/Backpack.png', href: '/products?cat=Backpacks', count: '3 styles' },
  { name: 'Accessories', img: '/assets/Category/Accessories.png', href: '/products?cat=Accessories', count: '3 items' },
]

const FEATURES = [
  { icon: '🔒', title: 'TSA-Approved Locks', desc: 'All luggage ships with certified combination locks for hassle-free security checks.' },
  { icon: '🛡️', title: 'Lifetime Warranty', desc: 'We stand behind our craftsmanship. Every piece backed by a lifetime guarantee.' },
  { icon: '🚀', title: 'Spinner Wheels', desc: '360° silent spinner wheels with a patented dual-bearing system for effortless glide.' },
  { icon: '📦', title: 'Free Shipping', desc: 'Complimentary shipping on all orders above ₹2,000 across India.' },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('/tables/products')
      .then(r => r.json())
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeFilter).slice(0, 8)

  const premiumProducts = products.filter(p => p.is_premium).slice(0, 3)
  const FILTER_TABS = ['all', 'Cabin Luggage', 'Check-in Luggage', 'Backpacks', 'Accessories']

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
              <span className="section-label">Priority Bags ✦ Est. 2020</span>
              <h1 className="hero-title">
                {s.title}<br />
                <span className="hero-accent">{s.titleAccent}</span>
              </h1>
              <p className="hero-subtitle">{s.subtitle}</p>
              <div className="hero-actions">
                <Link to={s.href} className="btn btn-gold btn-lg">{s.cta} →</Link>
                <Link to="/about" className="btn btn-ghost btn-lg">Our Story</Link>
              </div>
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

      {/* ── FEATURES BAR ── */}
      <section className="features-bar">
        <div className="container features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Browse by Category</span>
            <h2 className="section-title">Everything You Need to <span>Travel Well</span></h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(c => (
              <Link key={c.name} to={c.href} className="category-card card">
                <div className="category-img-wrap">
                  <img src={c.img} alt={c.name} loading="lazy" onError={e => { e.target.src='/assets/Category/Travelling%20Bag.png' }} />
                </div>
                <div className="category-info">
                  <h3>{c.name}</h3>
                  <span>{c.count}</span>
                  <span className="cat-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="products-section section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-label">Our Collection</span>
              <h2 className="section-title">Bestselling <span>Luggage</span></h2>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">View All →</Link>
          </div>

          <div className="filter-tabs">
            {FILTER_TABS.map(t => (
              <button
                key={t}
                className={`filter-tab ${activeFilter === t ? 'active' : ''}`}
                onClick={() => setActiveFilter(t)}
              >
                {t === 'all' ? 'All Products' : t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 380, borderRadius: 16 }} />)}
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── PREMIUM BANNER ── */}
      {premiumProducts.length > 0 && (
        <section className="premium-section section-pad">
          <div className="container">
            <div className="premium-inner">
              <div className="premium-text">
                <span className="section-label">Exclusive Access</span>
                <h2 className="section-title">The <span>Premium</span><br />Collection</h2>
                <p className="premium-desc">
                  Handcrafted with aerospace-grade polycarbonate. Designed for those who
                  refuse to compromise on quality or prestige.
                </p>
                <Link to="/premium" className="btn btn-gold btn-lg">Explore Premium →</Link>
              </div>
              <div className="premium-cards">
                {premiumProducts.map(p => (
                  <Link key={p.id} to={`/products/${p.id}`} className="premium-mini-card">
                    <img
                      src={p.image_url || '/assets/Category/Travelling%20Bag.png'}
                      alt={p.name}
                      onError={e => { e.target.src='/assets/Category/Travelling%20Bag.png' }}
                    />
                    <div className="premium-mini-info">
                      <p>{p.name}</p>
                      <span>{formatCurrency(p.price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST STRIP ── */}
      <section className="trust-strip section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="trust-inner">
            <div className="trust-stat"><span className="trust-num">50,000+</span><span className="trust-label">Happy Travellers</span></div>
            <div className="trust-divider" />
            <div className="trust-stat"><span className="trust-num">4.8★</span><span className="trust-label">Average Rating</span></div>
            <div className="trust-divider" />
            <div className="trust-stat"><span className="trust-num">15+</span><span className="trust-label">Countries Shipped</span></div>
            <div className="trust-divider" />
            <div className="trust-stat"><span className="trust-num">Lifetime</span><span className="trust-label">Warranty</span></div>
          </div>
        </div>
      </section>
    </main>
  )
}
