import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../hooks/useApi'
import './CartDrawer.css'

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQty, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    setIsOpen(false)
    navigate('/checkout')
  }

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)} />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div>
            <h2 className="cart-title">Your Cart</h2>
            <p className="cart-subtitle">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <button className="cart-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🧳</div>
              <p className="cart-empty-title">Your cart is empty</p>
              <p className="cart-empty-sub">Add some amazing luggage to get started</p>
              <button className="btn btn-gold btn-sm" onClick={() => { setIsOpen(false); navigate('/products') }}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.key} className="cart-item">
                  <div className="cart-item-img">
                    <img
                      src={item.image_url || '/assets/Category/Travelling%20Bag.png'}
                      alt={item.name}
                      onError={e => { e.target.src = '/assets/Category/Travelling%20Bag.png' }}
                    />
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-meta">{item.color} · {item.size}</p>
                    <div className="cart-item-bottom">
                      <div className="qty-control">
                        <button onClick={() => updateQty(item.key, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)}>+</button>
                      </div>
                      <span className="cart-item-price">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.key)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span className="cart-total-price">{formatCurrency(totalPrice)}</span>
            </div>
            <p className="cart-shipping-note">Shipping & taxes calculated at checkout</p>
            <button className="btn btn-gold btn-full btn-lg" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
            <button className="btn btn-ghost btn-full btn-sm" style={{marginTop: '10px'}} onClick={() => { setIsOpen(false); navigate('/products') }}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
