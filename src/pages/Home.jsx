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
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuATx2yBZO5s19JH_awbb2889JFg8x-zfiV8f5DJeeTUA6aD2dhdmvEMjbkK0POPx2JGttrGijM57aJ6bM-PyQZngmHjRnjEytwf990-Om4oJomdEuDxsEC0WxjEzovS_OcF4XnMNoj3LR6v2PMboEtcMoVJ3ie07E2reMiauInB-u7IAJVgpyPiq8OtFxClgt61ztDNEJ77s6EKEQ_J9g0r-7joF5Wi7oW-SSJeQkS4ouRgK2WKXdoRtViQd_H0OaYa0G2N-XmPHBo" 
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
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQVG6pZIuy0MgqzI2cFM_dqJAlCt-Di-RcaQU2anAxC56JJ_Yq79dfjPxcecTi5K3aUv1uSrHqAssTDmsQdU8nCvdQScdCHKXhB34lPA0huZ928J5Of-JahC6b_kqt41wLuB_clV0qYlK8jR4ADrk1GxM7HKLFsofhE5ImfhcTY6YFwdsx6mdlcgxBEKPKs-8V7WEqwNP3JFxaUFKYUa0T9O7Mch-UZDVZPgHG41lfCbEFGdHO2MkwItmE9ybJU0cTxwO1CuVtQGs" alt="L'Atelier Series" />
              </div>
              <div className="editorial-header">
                <h2 className="headline-large">L'Atelier Series</h2>
                <Link to="/products" className="label-mini editorial-underline">View Details</Link>
              </div>
            </div>

            {/* Supporting Item */}
            <div className="col-span-4 item-group" style={{ paddingBottom: '48px' }}>
              <div className="img-container aspect-3-4">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRPjKdenl59DoV06ITYXZkM2Q1kEuFidtWpDLE9h9JeG_SnDRZZ8_yvmWV-abxyWtZQr1wu89VwkAQiEyQ91ZDnYP-5nXwPbC60XCasv7wea7Vwj76_lJHGerQSuXUlJ9J4U6rnEMB-wANTtpG7MSx1dj_hek2R-7iHJ4N-B3ao8_aZPaXj-aSp5rgaL73tlinwkbaVgBtLt7NmSL8heyYn39oZgRuufTF7nDHHT5s33nE3YTIXwT6o8NMGW53gBzep-VGSii4z88" alt="Nocturne Collection" />
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
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPZ0snfTKIYvKNA_IoRCznsgM26OBDZIAbxwYwICpTQXerO8boRiiDBecK2OjKFT3RpcBVgKNqAffx7ky6VuNz8qTNGpS9R0kRzvnR3L6m_9k6J7vNkNS8CCCEJV64OydyN6Bubzwe204_Y8JAmuJEdhsrKSePhaUvaPYABO31U7YwG5wbNO_cs_LxTmXlhgEy6VszOWE35TbTm3M6fGweedGyeFxZwtl6x7UJhGAytUm8Z9QR4mCJwYqUM1jYuasr0Za380u09LQ" alt="Monolith Tote" />
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
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUyT35uR0WXcO_YEzR9oKBVz0Rmh2NHLg1NwZ1oKerE4YnN4o7BhiHstwtoz5Ee8-XLbNjrcJzprvSKe5huxNM3vzYgiJHAQzA3tQnjkYzIZ3Y74uASOC90HU7wPomgHvq0At_GefoCVUOmkrzw8ICD4YZYVoz5p_h_78dzvlszPK9fjXR7YIe238DJZ1LsbTcBArIN5TxQ86b7DB9u3QPfMbZMhBPJOfk2jxpTxXG9qH58nfXfA89rNejYpMJOeA95ni2wdAyxGA" alt="Master Craftsman" />
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
