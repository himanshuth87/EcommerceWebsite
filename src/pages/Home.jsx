import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/tables/products')
      .then(r => r.json())
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const bestsellers = products.filter(p => p.badge === 'Bestseller' || p.is_bestseller).slice(0, 4)

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero-luxury">
        <div className="hero-gradient-overlay" />
        <img 
          src="/assets/Creatives/hero-main.jpg" 
          alt="Luxury leather detail" 
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-title">High Prestige <br/><span className="italic">Leatherworks</span></h1>
          <Link to="/products" className="btn-primary">
            Discover More
          </Link>
        </div>
      </section>

      {/* ── EDITORIAL COLLECTION GRID ── */}
      <section className="editorial-section">
        <div className="container">
          <div className="grid-12">
            {/* Flagship Item */}
            <div className="col-span-8 item-group">
              <div className="img-container aspect-16-10">
                <img src="/assets/Creatives/1920%20%C3%97%201080%20px%20(1).jpg" alt="L'Atelier Series" />
              </div>
              <div className="editorial-header">
                <h2 className="headline-large">L'Atelier Series</h2>
                <Link to="/products" className="label-mini editorial-underline">View Details</Link>
              </div>
            </div>

            {/* Supporting Item */}
            <div className="col-span-4 item-group" style={{ paddingBottom: '48px' }}>
              <div className="img-container aspect-3-4">
                <img src="/assets/Creatives/1920%20%C3%97%201080%20px%20(2).jpg" alt="Nocturne Collection" />
              </div>
              <div>
                <h3 className="headline-medium">Nocturne Clutch</h3>
                <p className="label-mini" style={{ fontStyle: 'italic' }}>Limited Edition</p>
              </div>
            </div>
          </div>

          {/* Asymmetric Row */}
          <div className="grid-12" style={{ marginTop: '96px' }}>
            <div className="col-span-5 col-start-2 item-group">
              <div className="img-container aspect-square">
                <img src="/assets/Creatives/1920%20%C3%97%201080%20px%20(3).jpg" alt="Monolith Tote" />
              </div>
              <h3 className="headline-medium">The Monolith Tote</h3>
            </div>
            <div className="col-span-4 col-start-8" style={{ alignSelf: 'center' }}>
              <div className="quote-block">
                <span className="label-mini" style={{ letterSpacing: '0.4em' }}>Heritage Craft</span>
                <p className="quote-text">
                  "Every stitch is a testament to the decades of silent mastery within our Florence studio."
                </p>
                <Link to="/about" className="label-mini editorial-underline" style={{ color: 'var(--on-surface)' }}>Explore Our Story</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h2 className="headline-large">Our <span>Pieces</span></h2>
            <Link to="/products" className="btn-bespoke">View All Pieces</Link>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 450 }} />)}
            </div>
          ) : (
            <div className="products-grid">
              {bestsellers.map((p, i) => (
                <div key={p.id} className="reveal active" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BESPOKE SERVICES ── */}
      <section className="bespoke-section">
        <div className="container">
          <div className="bespoke-inner">
            <div className="bespoke-image-wrap">
              <img src="/assets/Creatives/1920%20%C3%97%201080%20px%20(5).jpg" alt="Master Craftsman" />
            </div>
            <div className="bespoke-content">
              <h2 className="headline-bespoke">Bespoke <br/>Craftsmanship</h2>
              <p className="body-bespoke">
                Personalize your PRIORITY with rare skins, custom hardware, and hand-embossed initials. A journey of co-creation with our master artisans.
              </p>
              <button className="btn-bespoke">Inquire Privately</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <span className="news-label">Join the Inner Circle</span>
            <h2 className="news-title">Elegance in your inbox.</h2>
            <p className="news-subtitle">Be the first to witness our seasonal unveilings and private events.</p>
            <form className="news-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="YOUR EMAIL ADDRESS" className="news-input" />
              <button type="submit" className="btn-news">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
