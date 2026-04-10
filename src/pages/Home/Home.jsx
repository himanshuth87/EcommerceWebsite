import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiFetch, formatCurrency } from '../../hooks/useApi'
import './Home.css'

const CATEGORIES = [
  {
    name: 'Backpacks',
    tag: 'Daily Carry',
    color: '#f4d35e',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    link: '/products?cat=Backpacks',
  },
  {
    name: 'Accessories',
    tag: 'Add-ons',
    color: '#a8e6cf',
    img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop',
    link: '/products?cat=Accessories',
  },
  {
    name: 'Travel',
    tag: 'Go anywhere',
    color: '#ffafcc',
    img: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=800&auto=format&fit=crop',
    link: '/products?cat=Travel',
  },
  {
    name: 'Campus',
    tag: 'Student picks',
    color: '#cdb4f7',
    img: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?q=80&w=800&auto=format&fit=crop',
    link: '/products?cat=Campus',
  },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiFetch('/api/v1/catalog/products')
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const featured = products.slice(0, 4)
  const trending = products.slice(4, 8)

  return (
    <main className="home-campus">

      {/* ── HERO ── */}
      <section className="campus-hero">
        <div className="hero-grid-pattern" />
        <div className="container campus-hero-grid">
          <div className="campus-hero-copy">
            <div className="hero-brand">PRIORITY</div>
            <h1 className="hero-title">
              <span className="hero-line-1">CARRY THE STYLE</span>
              <span className="hero-line-2">YOUR WAY</span>
              <span className="hero-line-3">EXPLORE CAMPUS PICKS</span>
            </h1>
          </div>

          <div className="campus-hero-visual">
            <img
              src="/assets/Creatives/hero-main.jpg"
              alt="Students with backpacks"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop' }}
            />
          </div>
        </div>
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
                <Link to={c.link}>
                  <div className="cat-tile-text">
                    <span className="cat-tag">{c.tag}</span>
                    <h3>{c.name}</h3>
                  </div>
                  <img src={c.img} alt={c.name} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY BANNER ── */}
      <section className="campus-banner-wrap">
        <div className="container">
          <motion.div
            className="campus-banner"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="banner-text">
              <span className="banner-eyebrow">HOLIDAY SEASON</span>
              <h2>Ready for<br />your Journey</h2>
              <p>Up to 40% off on travel-ready packs. Fly light, stay loud.</p>
              <Link to="/products" className="btn-pill btn-pill-dark">Shop the sale →</Link>
            </div>
            <div className="banner-visual">
              <img
                src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1200&auto=format&fit=crop"
                alt="Travel backpack"
              />
            </div>
          </motion.div>
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
