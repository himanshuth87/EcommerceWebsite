import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Bestseller')

  useEffect(() => {
    fetch('/api/v1/catalog/products')
      .then(r => r.json())
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Filter products based on active tab
  const tabProducts = products.filter(p => p.badge === activeTab).slice(0, 4)
  const featuredProduct = products.find(p => p.badge === activeTab) || products[0]

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero-luxury">
        <div className="hero-gradient-overlay" />
        <img src="/assets/Creatives/hero-main.jpg" alt="Luxury Travel" className="hero-image" />
      </section>

      {/* ── NEW PRODUCT SHOWCASE (TABBED) ── */}
      <section className="tabbed-showcase reveal">
        <div className="container">
          {/* Tabs Container */}
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'New' ? 'active' : ''}`} onClick={() => setActiveTab('New')}>New Arrivals</button>
            <button className={`tab-btn ${activeTab === 'Bestseller' ? 'active' : ''}`} onClick={() => setActiveTab('Bestseller')}>Bestseller</button>
          </div>

          <div className="showcase-split-layout">
            {/* Left Feature Image */}
            <div className="showcase-feature">
              <div className="feature-img-box">
                <img src={featuredProduct?.image_url || '/assets/Creatives/editorial-1.jpg'} alt="Feature" />
                <div className="feature-overlay">
                  <Link to="/products" className="view-all-btn">VIEW ALL</Link>
                </div>
              </div>
            </div>

            {/* Right Products Grid */}
            <div className="showcase-products">
              <div className="products-inline-grid">
                {loading ? (
                  [...Array(4)].map((_, i) => <div key={i} className="skeleton-thumb" />)
                ) : (
                  tabProducts.map(p => (
                    <div key={p.id} className="thumb-item">
                       <Link to={`/products/${p.id}`} className="thumb-link">
                          <img src={p.image_url} alt={p.name} />
                          <div className="thumb-info">
                             <h4>{p.name}</h4>
                             <p className="thumb-price">
                                <span className="old">MRP ₹{Math.floor(p.price*1.1)}</span> 
                                ₹{p.price?.toLocaleString()}
                             </p>
                          </div>
                       </Link>
                    </div>
                  ))
                )}
              </div>
              <div className="bottom-view-all">
                <Link to="/products" className="view-all-dark">VIEW ALL</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECONDARY PROMO BANNER ── */}
      <section className="promo-banner-section reveal">
        <div className="container">
          <div className="promo-split">
            <div className="promo-visual">
               <img src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=1600&auto=format&fit=crop" alt="Icon Series" />
               <div className="promo-overlay-text">ION</div>
            </div>
            <div className="promo-text-box">
               <div className="promo-text-content">
                  <p className="promo-sub">VIP ION</p>
                  <h2 className="promo-title">Lightweight. Durable. Effortless.</h2>
                  <p className="promo-body">
                    Meet VIP Ion — the perfect blend of strength and style for today's traveler. Crafted with a tough polycarbonate shell and smooth 360° spinner wheels, Ion keeps your journeys hassle-free and your belongings safe.
                  </p>
                  <Link to="/products" className="promo-btn">SHOP NOW</Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
