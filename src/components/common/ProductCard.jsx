import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { formatCurrency, calcDiscount } from '../../hooks/useApi'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart, setIsOpen } = useCart()
  const discount = calcDiscount(product.original_price, product.price)

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
    setIsOpen(true)
  }

  return (
    <motion.div 
      className="product-card-atelier"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
    >
      <Link to={`/products/${product.id}`} className="card-inner">
        <div className="product-media glass">
          <img
            src={product.image_url}
            alt={product.name}
            className="main-img"
            loading="lazy"
            onError={e => { e.target.src = '/assets/Category/Travelling Bag.png' }}
          />
          <div className="media-overlay">
            <button className="quick-add label-sm" onClick={handleAdd}>Quick Add</button>
          </div>
          {product.badge && (
            <span className="premium-badge label-xs">{product.badge}</span>
          )}
          {product.stock <= 0 && <span className="premium-badge label-xs sold-out">Archived</span>}
        </div>

        <div className="product-details">
          <div className="title-row">
            <h3 className="editorial-header">{product.name}</h3>
            {discount && <span className="discount-tag label-xs">-{discount}%</span>}
          </div>
          
          <div className="price-row">
            <span className="current-price">{formatCurrency(product.price)}</span>
            {product.original_price > product.price && (
              <span className="old-price">{formatCurrency(product.original_price)}</span>
            )}
          </div>

          <div className="card-footer">
            <div className="rating-pill glass">
              <span className="material-symbols-outlined star-icon">star</span>
              <span className="label-xs">{product.rating || '4.8'}</span>
            </div>
            <div className="color-hint label-xs">{product.color_count || '2'}+ Colours</div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

