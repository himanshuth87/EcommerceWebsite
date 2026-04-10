import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiFetch, formatCurrency } from '../../hooks/useApi'
import './Home.css'

const CATEGORIES = [
  {
    name: 'Backpacks',
    color: '#f4d35e',
    img: '/assets/Category/Backpack.png',
    link: '/products?cat=Backpack',
  },
  {
    name: 'Accessories',
    color: '#a8e6cf',
    img: '/assets/Category/Accessories.png',
    link: '/products?cat=Accessories',
  },
  {
    name: 'Travel',
    color: '#ffafcc',
    img: '/assets/Category/Travelling Bag.png',
    link: '/products?cat=Luggage',
  },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('COLLEGE BACKPACKS')

  useEffect(() => {
    setLoading(true)
    apiFetch('/api/v1/catalog/products')
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const TABS = [
    'COLLEGE BACKPACKS', 
    'SCHOOL BACKPACKS', 
    'LAPTOP BACKPACKS', 
    'TREKKING BACKPACKS'
  ]

  const featured = products.slice(0, 4)
  const trending = products.slice(4, 8)

  return (
    <main className="home-campus">

      {/* ── HERO BANNER ── */}
      <section className="campus-hero">
        <img
          className="campus-hero-banner"
          src="/assets/Creatives/hero-main.jpg"
          alt="Priority — Carry the style your way"
        />
      </section>

      {/* ── CATEGORY TILES ── */}
      <section className="campus-categories">
        <div className="container">
          <div className="cat-grid">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={c.name}
                className="cat-tile"
                style={{ background: c.color }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link to={c.link} aria-label={c.name}>
                  <img src={c.img} alt={c.name} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVAL SECTION (IMAGE REFERENCE) ── */}
      <section className="new-arrival-editorial">
        <div className="container">
          {/* Tabs */}
          <nav className="category-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="editorial-grid">
            {/* Left Column: Mustard Banner */}
            <div className="editorial-banner">
              <div className="banner-mustard">
                <img src="/assets/Creatives/editorial-1.jpg" alt="Trendy College" />
                <div className="banner-overlay">
                  <h2 className="banner-tag">TRENDY COLLEGE<br /><span>BACKPACKS</span></h2>
                </div>
              </div>
            </div>

            {/* Right Column: 3 products */}
            <div className="editorial-products">
              <div className="grid-3">
                {(loading || products.length === 0)
                  ? [...Array(3)].map((_, i) => <div key={i} className="skeleton arrival-skeleton" />)
                  : products.slice(0, 3).map(p => <ArrivalProductCard key={p.id} product={p} />)}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── FEATURED PRODUCTS ── */}
      <section className="campus-products">
        <div className="container">
          <div className="products-head">
            <div>
              <span className="section-eyebrow">Featured</span>
              <h2>Picked for you</h2>
            </div>
            <Link to="/products" className="see-all">View all →</Link>
          </div>

          <div className="product-grid">
            {loading
              ? [...Array(4)].map((_, i) => <div key={i} className="skeleton product-skeleton" />)
              : featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      {!loading && trending.length > 0 && (
        <section className="campus-products alt">
          <div className="container">
            <div className="products-head">
              <div>
                <span className="section-eyebrow">Trending</span>
                <h2>Most loved this week</h2>
              </div>
              <Link to="/products" className="see-all">View all →</Link>
            </div>

            <div className="product-grid">
              {trending.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function ArrivalProductCard({ product }) {
  return (
    <div className="arrival-product-card">
      <div className="card-image-wrap">
        <img src={product.image_url} alt={product.name} />
        <span className="badge-new">NEW</span>
      </div>
      <div className="card-info">
        <h3 className="card-title">{product.name}</h3>
        <div className="card-rating">
          <span className="stars">★★★★★</span>
          <span className="reviews">10 reviews</span>
        </div>
        <div className="card-pricing">
          <span className="price-curr">₹ {product.price}.00</span>
          <span className="price-old">₹ {product.price * 1.5}.00</span>
          <span className="price-off">50% off</span>
        </div>
        <button className="btn-move-cart">+ MOVE TO CART</button>
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-img">
        <img src={product.image_url} alt={product.name} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </div>
      <div className="product-meta">
        <h4>{product.name}</h4>
        <p>{formatCurrency(product.price)}</p>
      </div>
    </Link>
  )
}
