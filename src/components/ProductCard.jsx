import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency, getBadgeClass, calcDiscount, COLOR_MAP } from '../hooks/useApi'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart, setIsOpen } = useCart()
  const discount = calcDiscount(product.original_price, product.price)

  let colors = []
  try { colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : (product.colors || []) } catch {}

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
    setIsOpen(true)
  }

  // Fallback if image fails or path is weird
  const getImgSrc = (url) => {
    if (!url) return '/assets/Category/Travelling Bag.png'
    if (url.startsWith('Public/')) return '/' + url.replace('Public/', 'assets/')
    return url
  }

  return (
    <div className="product-card-container">
      <Link to={`/products/${product.id}`} className="product-card">
        <div className="product-img-wrap">
          <img
            src={getImgSrc(product.image_url)}
            alt={product.name}
            loading="lazy"
            onError={e => { e.target.src = '/assets/Category/Travelling Bag.png' }}
          />
          {product.badge && (
            <span className={`badge ${getBadgeClass(product.badge)} product-badge`}>{product.badge}</span>
          )}
          {product.stock <= 0 && <span className="badge badge-soldout product-badge">SOLD OUT</span>}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-price-row">
            <span className="price-current">{formatCurrency(product.price)}</span>
            {product.original_price > product.price && (
              <span className="price-original">{formatCurrency(product.original_price)}</span>
            )}
            <div className="product-rating-inline">
              <span className="rating-val">{product.rating || '0.0'}</span>
              <span className="material-symbols-outlined rating-star">star</span>
            </div>
          </div>

          <p className="product-color-label">Colour</p>
          <div className="product-swatches">
            {/* Simple swatches for now. Real implementation might use variant images. */}
            {colors.length > 0 ? (
              colors.map(c => (
                <div 
                  key={c} 
                  className="swatch-dot" 
                  style={{ background: COLOR_MAP[c] || '#ccc' }} 
                  title={c}
                />
              ))
            ) : (
                <div className="swatch-dot" style={{ background: '#eee' }} />
            )}
          </div>
        </div>
      </Link>
      
      {/* Quick Add button overlay can be added if desired */}
    </div>
  )
}
