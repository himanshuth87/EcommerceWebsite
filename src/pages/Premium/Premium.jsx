import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../../components/common/ProductCard'
import { apiFetch } from '../../hooks/useApi'
import './Premium.css'

export default function Premium() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiFetch('/api/v1/catalog/products')
      .then(d => {
        const all = d.data || []
        const premium = all.filter(p => p.badge === 'Premium' || p.price > 15000)
        setProducts(premium.length > 0 ? premium : all.slice(0, 4))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] }
  }

  return (
    <main className="premium-atelier section-pad" data-theme="dark">
      <div className="container">
      <div className="premium-hero-container">
        {/* Cinematic Hero Background */}
        <div className="premium-visual">
          <img src="/assets/Creatives/editorial-5.jpg" alt="Premium Craftsmanship" className="premium-hero-img" />
          <div className="premium-overlay" />
        </div>

        <div className="container">
          <section className="premium-hero">
            <motion.div 
              className="premium-hero-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <span className="label-sm gold-gradient-text editorial-header" style={{ letterSpacing: '8px' }}>THE SIGNATURE ARCHIVE</span>
              <h1 className="editorial-header display-lg">
                Precision <br /> <span className="gold-gradient-text">Manifesto</span>
              </h1>
              <p className="body-md opacity-70" style={{ maxWidth: '600px', margin: '20px 0 40px' }}>
                Each piece in the Signature Line is a masterclass in industrial design. Crafted with titanium-infused polycarbonate and serialized for authenticity. For the voyager who demands the absolute summit of performance.
              </p>
            </motion.div>
          </section>
        </div>
      </div>

        {/* Exclusive Archives */}
        <section className="premium-catalog">
          <div className="section-intro">
            <h2 className="editorial-header gold-gradient-text">The Archives</h2>
          </div>
          
          <div className="premium-grid">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="skeleton premium-skeleton" />)
            ) : (
              products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </section>

        {/* Craftsmanship Manifesto */}
        <section className="manifesto-grid">
          {[
            { num: '01', title: 'Aerospace Grade', desc: 'Crafted with Makrolon® — a high-impact polycarbonate that deflects force with absolute structural memory.' },
            { num: '02', title: 'Silent Kinetic', desc: 'Japanese-engineered 360° wheels with internal suspension, tested for near-silent glide across global terrain.' },
            { num: '03', title: 'Security Redefined', desc: 'Recessed TSA-approved locking systems, seamlessly integrated into the shell architecture.' },
            { num: '04', title: 'Limited Legacy', desc: 'Each Signature piece is individually numbered and carries a worldwide lifetime commitment.' },
          ].map(s => (
            <motion.div key={s.num} className="manifesto-item glass" {...fadeInUp}>
              <span className="label-sm gold-gradient-text opacity-50">{s.num}</span>
              <h3 className="editorial-header">{s.title}</h3>
              <p className="body-sm opacity-50">{s.desc}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  )
}
