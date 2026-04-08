import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch, formatCurrency } from '../../hooks/useApi'
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('New')

  useEffect(() => {
    setLoading(true)
    apiFetch('/api/v1/catalog/products')
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const tabProducts = products.filter(p => !activeTab || p.badge === activeTab).slice(0, 4)
  const featuredProduct = products.find(p => p.badge === activeTab) || products[0]

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <main className="home-atelier" data-theme="dark">
      {/* ── HERO SECTION ── */}
      <section className="hero-section">
        <motion.div 
          className="hero-content container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <span className="label-xs gold-gradient-text" style={{ letterSpacing: '8px' }}>COLLECTION 2026</span>
          <h1 className="hero-headline editorial-header">
            Redefining <br /> Modern Luxury
          </h1>
          <p className="hero-subline">Crafted for the global odyssey.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">Explore All</Link>
            <Link to="/products?cat=Premium" className="btn btn-outline">Premium Series</Link>
          </div>
        </motion.div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1544648154-1772eb373155?q=80&w=2070&auto=format&fit=crop" alt="Luxury Travel" className="hero-img" />
          <div className="hero-overlay" />
        </div>
      </section>

      {/* ── BRAND NARRATIVE ── */}
      <section className="brand-narrative section-pad">
        <div className="container">
          <div className="narrative-grid">
            <motion.div className="narrative-text" {...fadeInUp}>
              <h2 className="display-md editorial-header">The Art of <br /> Engineering</h2>
              <p>Every piece is a testament to precision. We don't just manufacture bags; we curate experiences. Our materials are sourced from the finest tanneries and tech-labs to ensure your journey is as seamless as your destination.</p>
            </motion.div>
            <motion.div 
              className="narrative-visual glass"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
            >
              <img src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1886&auto=format&fit=crop" alt="Craftsmanship" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TABBED SHOWCASE ── */}
      <section className="collection-showcase section-pad">
        <div className="container">
          <motion.div className="section-intro" {...fadeInUp}>
            <span className="label-sm gold-gradient-text editorial-header">Priority Selects</span>
            <h2 className="display-sm editorial-header">The Curated Line</h2>
          </motion.div>

          <div className="collection-tabs">
            {['New', 'Bestseller', 'Premium'].map(tab => (
              <button 
                key={tab}
                className={`tab-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && <motion.div layoutId="tab-underline" className="tab-underline" />}
              </button>
            ))}
          </div>

          <div className="showcase-grid-layout">
            <motion.div 
              className="featured-box"
              key={activeTab + '-feature'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="feature-img-wrapper glass">
                <img src={featuredProduct?.image_url || 'https://images.unsplash.com/photo-1622560480654-d82fab97c64b?q=80&w=1887&auto=format&fit=crop'} alt="Featured" />
                <div className="feature-content">
                  <h3 className="editorial-header">{featuredProduct?.name || 'Signature Series'}</h3>
                  <Link to={featuredProduct ? `/products/${featuredProduct.id}` : '/products'} className="editorial-underline">View Details</Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="thumb-grid"
              variants={stagger}
              initial="initial"
              animate="animate"
              key={activeTab + '-grid'}
            >
              {loading ? (
                [...Array(4)].map((_, i) => <div key={i} className="skeleton thumb-skeleton" />)
              ) : (
                tabProducts.length > 0 ? (
                  tabProducts.map(p => (
                    <motion.div 
                      key={p.id} 
                      className="thumb-card"
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 }
                      }}
                    >
                      <Link to={`/products/${p.id}`}>
                        <div className="thumb-vessel glass">
                          <img src={p.image_url} alt={p.name} />
                        </div>
                        <div className="thumb-meta">
                          <h4>{p.name}</h4>
                          <p>{formatCurrency(p.price)}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state-notice">Discovering new arrivals...</div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

