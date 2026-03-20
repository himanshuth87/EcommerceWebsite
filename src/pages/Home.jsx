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

const CATEGORIES = [
  { name: 'Cabin Luggage', img: '/assets/Category/Travelling%20Bag.png', href: '/products?cat=Cabin+Luggage', count: '3 styles' },
  { name: 'Check-in Luggage', img: '/assets/Category/Travelling%20Bag.png', href: '/products?cat=Check-in+Luggage', count: '2 styles' },
  { name: 'Backpacks', img: '/assets/Category/Backpack.png', href: '/products?cat=Backpacks', count: '3 styles' },
  { name: 'Accessories', img: '/assets/Category/Accessories.png', href: '/products?cat=Accessories', count: '3 items' },
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



      {/* ── CATEGORIES ── */}
      <section className="categories section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Browse by Category</span>
            <h2 className="section-title">Shop by <span>Collection</span></h2>
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
              <h2 className="section-title">Best<span>sellers</span></h2>
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
