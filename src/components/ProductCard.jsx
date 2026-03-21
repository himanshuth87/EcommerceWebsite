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

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-img-wrap">
        <img
          src={product.image_url || '/assets/Category/Travelling%20Bag.png'}
          alt={product.name}
          loading="lazy"
          onError={e => { e.target.src = '/assets/Category/Travelling%20Bag.png' }}
        />
        {product.badge && (
          <span className={`badge ${getBadgeClass(product.badge)} product-badge`}>{product.badge}</span>
        )}
        <button className="quick-add-btn btn btn-gold btn-sm" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>

        {colors.length > 0 && (
          <div className="product-colors">
            {colors.slice(0, 5).map(c => (
              <span key={c} className="color-dot" title={c} style={{ background: COLOR_MAP[c] || '#888' }} />
            ))}
            {colors.length > 5 && <span className="color-more">+{colors.length - 5}</span>}
          </div>
        )}

        <div className="product-price-row">
          <span className="product-price">{formatCurrency(product.price)}</span>
          {product.original_price > product.price && (
            <>
              <span className="product-orig">{formatCurrency(product.original_price)}</span>
              <span className="product-disc">-{discount}%</span>
            </>
          )}
        </div>

        {product.rating > 0 && (
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span className="rating-count">({product.reviews || 0})</span>
          </div>
        )}
      </div>
    </Link>
  )
}
