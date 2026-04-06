import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch, formatCurrency } from '../hooks/useApi'
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Bestseller')

  useEffect(() => {
    setLoading(true)
    apiFetch('/api/v1/catalog/products')
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const tabProducts = products.filter(p => p.badge === activeTab).slice(0, 4)
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
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.h1 
            className="hero-headline editorial-header"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          >
            Refining the Art <br />
            <span className="gold-gradient-text">Of Odyssey</span>
          </motion.h1>
          <motion.p 
            className="hero-subline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          >
            Engineered for the Modern Voyager. Crafted for the Decisive Soul.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <Link to="/products" className="btn btn-primary">Discover the Collection</Link>
          </motion.div>
        </motion.div>
        <div className="hero-visual">
          <img src="/assets/Creatives/hero-main.jpg" alt="Luxury Travel" className="hero-img" />
          <div className="hero-overlay" />
        </div>
      </section>

      {/* ── TABBED SHOWCASE (The Collection) ── */}
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
                <img src={featuredProduct?.image_url || '/assets/Creatives/editorial-1.jpg'} alt="Featured" />
                <div className="feature-content">
                  <h3 className="editorial-header">{featuredProduct?.name || 'Signature Series'}</h3>
                  <Link to={`/products/${featuredProduct?.id}`} className="editorial-underline">View Details</Link>
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
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CRAFTSMANSHIP SECTION ── */}
      <section className="craft-section section-split">
        <div className="container">
          <div className="craft-layout">
            <motion.div className="craft-visual" {...fadeInUp}>
              <img src="/assets/Creatives/editorial-2.jpg" alt="Craftsmanship" className="craft-img" />
              <div className="craft-accent glass">
                <p className="label-xs">01 / ARCHITECTURE</p>
                <h3>Engineered Integrity</h3>
              </div>
            </motion.div>
            <motion.div className="craft-info" {...fadeInUp}>
              <h2 className="editorial-header">Built for the <br /> <span className="gold-gradient-text">Infinite Path</span></h2>
              <p className="body-md">
                Every Priority bag is a masterclass in industrial design. Utilizing high-impact polycarbonate and reinforced recycled aircraft-grade aluminum, our shells are designed to deflect the rigors of global transit while maintaining a silhouette of pure elegance.
              </p>
              <ul className="spec-list">
                <li><span>Material</span> <span>Makrolon® Polycarbonate</span></li>
                <li><span>Hardware</span> <span>Japanese 360° Hinomoto Wheels</span></li>
                <li><span>Security</span> <span>Integrated TSA Lock System</span></li>
              </ul>
              <Link to="/about" className="btn btn-outline">Our Philosophy</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL BANNER ── */}
      <section className="editorial-banner">
        <div className="banner-vessel">
          <img src="/assets/Creatives/editorial-3.jpg" alt="Editorial" />
          <div className="banner-overlay glass">
            <h2 className="editorial-header gold-gradient-text">Quiet Luxury. <br /> Loud Legacy.</h2>
          </div>
        </div>
      </section>
    </main>
  )
}

