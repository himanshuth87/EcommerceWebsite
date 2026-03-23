import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/catalog/products')
      .then(r => r.json())
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Get the first 3 bestsellers for editorial display
  const editorialBestsellers = products.filter(p => p.badge === 'Bestseller' || p.is_bestseller).slice(0, 3)
  // Get others for the grid
  const standardBestsellers = products.filter(p => p.badge === 'Bestseller' || p.is_bestseller).slice(3, 7)
  // Get New Arrivals
  const newArrivals = products.filter(p => p.badge === 'New').slice(0, 4)
  // Featured Showcase Product (Front Open Luggage)
  const featuredProduct = products.find(p => p.name?.toLowerCase().includes('luggage') || p.name?.toLowerCase().includes('cabin')) || products[0]

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
      </section>

      {/* ── EDITORIAL COLLECTION GRID ── */}
      <section className="editorial-section">
        <div className="container">
          <div className="grid-12">
            {/* Slot 1: Flagship Item */}
            <div className="col-span-8 item-group">
              <div className="img-container aspect-16-10">
                {editorialBestsellers[0] ? (
                  <Link to={`/products/${editorialBestsellers[0].id}`}>
                    <img src={editorialBestsellers[0].image_url} alt={editorialBestsellers[0].name} />
                  </Link>
                ) : (
                  <img src="/assets/Creatives/editorial-1.jpg" alt="Collection Piece" />
                )}
              </div>
            </div>

            {/* Slot 2: Supporting Item */}
            <div className="col-span-4 item-group" style={{ paddingBottom: '48px' }}>
              <div className="img-container aspect-3-4">
                {editorialBestsellers[1] ? (
                  <Link to={`/products/${editorialBestsellers[1].id}`}>
                    <img src={editorialBestsellers[1].image_url} alt={editorialBestsellers[1].name} />
                  </Link>
                ) : (
                  <img src="/assets/Creatives/editorial-2.jpg" alt="Collection Piece" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED VIDEO SHOWCASE ── */}
      <section className="showcase-section">
        <div className="container">
          <div className="showcase-grid">
            <div className="showcase-visual">
              <video 
                className="showcase-video"
                autoPlay 
                muted 
                loop 
                playsInline
                poster="/assets/Creatives/hero-main.jpg"
              >
                <source src="https://v1.mixkit.co/videos/download/mixkit-opening-a-luxury-hard-suitcase-40091-medium.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="showcase-text">
              <h2 className="showcase-title">Pack - Expand - Explore</h2>
              <p className="showcase-body">
                Step into a new era of travel with our "Front Open" series. Engineered for effortless access and featuring a 25% expandable packing capacity, it's the ultimate companion for your spontaneous escapes and extended journeys.
              </p>
              {featuredProduct && (
                <Link to={`/products/${featuredProduct.id}`} className="btn-showcase">
                  SHOP NOW
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ── NEW ARRIVALS ── */}
      <section className="bespoke-section">
        <div className="container">
          <div className="products-header" style={{ marginBottom: '48px' }}>
            <h2 className="headline-large">New <span>Arrivals</span></h2>
          </div>
          <div className="products-grid">
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 450 }} />)
            ) : (
              newArrivals.length > 0 ? (
                newArrivals.map((p, i) => (
                  <div key={p.id} className="reveal active" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div className="bespoke-inner">
                  <div className="bespoke-image-wrap">
                    <img src="/assets/Creatives/editorial-5.jpg" alt="Master Craftsman" />
                  </div>
                  <div className="bespoke-content">
                    <p className="body-bespoke" style={{ opacity: 0.6 }}>Our master collection of new arrivals.</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

    </main>
  )
}
