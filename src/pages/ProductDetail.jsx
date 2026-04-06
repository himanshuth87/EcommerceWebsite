import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { apiFetch, formatCurrency, calcDiscount, COLOR_MAP, getBadgeClass } from '../hooks/useApi'
import ProductCard from '../components/ProductCard'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart, setIsOpen } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const [toast, setToast] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    apiFetch('/api/v1/catalog/products')
      .then(d => {
        const all = d.data || []
        const found = all.find(p => String(p.id) === String(id))
        setProduct(found || null)
        if (found) {
          setRelated(all.filter(p => (p.category === found.category) && String(p.id) !== String(found.id)).slice(0, 4))
          let clrs = []
          try { clrs = typeof found.colors === 'string' ? JSON.parse(found.colors) : (found.colors || []) } catch {}
          let szs = []
          try { szs = typeof found.sizes === 'string' ? JSON.parse(found.sizes) : (found.sizes || []) } catch {}
          setSelectedColor(clrs[0] || null)
          setSelectedSize(szs[0] || null)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("PD Load error:", err)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className="pd-loading">
      <div className="skeleton pd-img-skel" />
      <div className="pd-info-skel">
        {[200, 120, 80, 160, 100].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: 20, width: w, borderRadius: 6, marginBottom: 16 }} />
        ))}
      </div>
    </div>
  )

  if (!product) return (
    <div className="pd-not-found container">
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-gold">Back to Products</Link>
    </div>
  )

  let colors = []
  try { colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : (product.colors || []) } catch {}
  let sizes = []
  try { sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : (product.sizes || []) } catch {}
  let features = []
  try { features = typeof product.features === 'string' ? JSON.parse(product.features) : (product.features || []) } catch {}

  const discount = calcDiscount(product.original_price, product.price)

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, qty)
    setIsOpen(true)
  }

  return (
    <main className="pd-page home-atelier" data-theme="dark">
      <div className="container">
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/products">Products</Link> <span>/</span>
          <Link to={`/products?cat=${product.category}`}>{product.category}</Link> <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="pd-main-grid">
          {/* Image */}
          <div className="pd-image-section">
            <div className="pd-img-frame">
              <img
                src={(function() {
                  let mapping = {}
                  try { mapping = typeof product.variant_images === 'string' ? JSON.parse(product.variant_images) : (product.variant_images || {}) } catch {}
                  return mapping[selectedColor] || product.image_url || '/assets/Category/Travelling%20Bag.png'
                })()}
                alt={product.name}
                key={selectedColor} // Force re-render/animation on color change
                onError={e => { e.target.src = '/assets/Category/Travelling%20Bag.png' }}
              />
              {product.badge && (
                <span className={`badge ${getBadgeClass(product.badge)} pd-badge`}>{product.badge}</span>
              )}
              {discount && (
                <span className="pd-discount-tag">-{discount}%</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <p className="pd-category">{product.category}</p>
            <h1 className="pd-title">{product.name}</h1>

            {product.rating > 0 && (
              <div className="pd-rating">
                <span className="stars">
                  {'★'.repeat(Math.min(5, Math.max(0, Math.floor(product.rating))))}
                  {'☆'.repeat(Math.max(0, 5 - Math.min(5, Math.max(0, Math.floor(product.rating)))))}
                </span>
                <span className="pd-rating-val">{product.rating}</span>
                <span className="pd-rating-count">({product.reviews || 0} reviews)</span>
              </div>
            )}

            <div className="pd-price-row">
              <span className="pd-price">{formatCurrency(product.price)}</span>
              {product.original_price > product.price && (
                <span className="pd-orig">{formatCurrency(product.original_price)}</span>
              )}
              {discount && <span className="pd-disc">{discount}% OFF</span>}
            </div>

            <div className="pd-divider" />

            {/* Colors */}
            {colors.length > 0 && (
              <div className="pd-option-group">
                <p className="pd-option-label">Color: <strong>{selectedColor}</strong></p>
                <div className="pd-colors">
                  {colors.map(c => (
                    <button
                      key={c}
                      title={c}
                      className={`pd-color-btn ${selectedColor === c ? 'active' : ''}`}
                      style={{ background: COLOR_MAP[c] || '#888' }}
                      onClick={() => setSelectedColor(c)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="pd-option-group">
                <p className="pd-option-label">Size: <strong>{selectedSize}</strong></p>
                <div className="pd-sizes">
                  {sizes.map(s => (
                    <button
                      key={s}
                      className={`pd-size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="pd-add-row">
              <div className="qty-control pd-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <button className="btn btn-gold pd-add-btn" onClick={handleAddToCart}>
                Add to Cart →
              </button>
            </div>

            {/* Specs */}
            <div className="pd-specs">
              {product.weight && <div className="pd-spec"><span>Weight</span><span>{product.weight}</span></div>}
              {product.material && <div className="pd-spec"><span>Material</span><span>{product.material}</span></div>}
              {product.lock_type && <div className="pd-spec"><span>Lock</span><span>{product.lock_type}</span></div>}
              {product.stock != null && <div className="pd-spec"><span>Stock</span><span>{product.stock > 0 ? `${product.stock} units` : '⚠ Low stock'}</span></div>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs">
          <div className="pd-tab-nav">
            {['desc', 'features', 'warranty'].map(t => (
              <button key={t} className={`pd-tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {{ desc: 'Description', features: 'Features', warranty: 'Warranty & Returns' }[t]}
              </button>
            ))}
          </div>
          <div className="pd-tab-content">
            {tab === 'desc' && <p className="pd-desc">{product.description || 'Premium quality luggage crafted for the discerning traveller. Built to last a lifetime with elegant design and robust construction.'}</p>}
            {tab === 'features' && (
              <ul className="pd-features-list">
                {features.length > 0 ? features.map((f, i) => <li key={i}>{f}</li>) : (
                  ['Premium polycarbonate shell', 'TSA-approved combination lock', '360° silent spinner wheels', 'Expandable main compartment', 'Interior organiser pockets'].map((f, i) => <li key={i}>{f}</li>)
                )}
              </ul>
            )}
            {tab === 'warranty' && (
              <div className="pd-warranty">
                <h4>🛡️ Lifetime Warranty</h4>
                <p>We stand behind the quality of every Priority Bags product with a comprehensive lifetime warranty against manufacturing defects.</p>
                <h4>🔄 Easy Returns</h4>
                <p>Not satisfied? Return within 30 days for a full refund or exchange. No questions asked.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="pd-related">
            <h2 className="section-title" style={{ marginBottom: 32 }}>You May Also <span>Like</span></h2>
            <div className="products-grid-related">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
