import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import './Premium.css'

export default function Premium() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/tables/products')
      .then(r => r.json())
      .then(d => {
        const all = d.data || []
        const premium = all.filter(p => p.is_premium)
        setProducts(premium.length > 0 ? premium : all.sort((a,b) => b.price - a.price).slice(0, 4))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="premium-page">
      {/* Hero */}
      <section className="premium-hero">
        <div className="premium-hero-bg" />
        <div className="container premium-hero-content">
          <span className="section-label">Exclusive Collection</span>
          <h1 className="section-title premium-title">
            Where Luxury<br /><span>Meets Precision</span>
          </h1>
          <p className="premium-hero-sub">
            Each piece in the Premium Collection is crafted with aerospace-grade polycarbonate,
            brushed aluminium accents, and limited-edition finishes. For the traveller who
            accepts nothing less than extraordinary.
          </p>
          <div className="premium-badges-row">
            {['Aerospace Polycarbonate', 'Hand-Finished', 'Numbered Edition', 'Lifetime Warranty'].map(b => (
              <span key={b} className="premium-feature-badge">✦ {b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="premium-products section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-label">The Range</span>
            <h2 className="section-title">Premium <span>Selection</span></h2>
          </div>
          {loading ? (
            <div className="premium-grid">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 420, borderRadius: 16 }} />)}
            </div>
          ) : (
            <div className="premium-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Craft Story */}
      <section className="premium-story section-pad" style={{paddingTop: 0}}>
        <div className="container">
          <div className="premium-story-grid">
            {[
              { num: '01', title: 'Material Selection', desc: 'We source only aircraft-grade polycarbonate — 30% stronger than standard shells at half the weight.' },
              { num: '02', title: 'Precision Engineering', desc: 'Our 360° spinner wheels use a dual-bearing system, tested for silent, smooth movement across 50km of tiles.' },
              { num: '03', title: 'Hand-Finishing', desc: 'Each Premium piece is individually inspected, aligned, and signed off by our master craftspeople.' },
              { num: '04', title: 'Lifetime Guarantee', desc: 'Buy once, own forever. We repair or replace any manufacturing defect for the life of your luggage.' },
            ].map(s => (
              <div key={s.num} className="story-step card">
                <span className="story-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
