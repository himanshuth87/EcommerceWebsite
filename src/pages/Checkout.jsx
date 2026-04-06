import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, apiFetch } from '../hooks/useApi'
import './Checkout.css'

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: user?.name || '', email: '', phone: '', address: '', city: '', pincode: '', state: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleOrder = async () => {
    setLoading(true)
    setError('')
    try {
      await apiFetch('/api/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: totalPrice, customerName: form.name, email: form.email, phone: form.phone }),
      })
      clearCart()
      setSuccess(true)
    } catch (err) {
      setError('Payment initiation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !success) return (
    <div className="checkout-empty">
      <div className="checkout-empty-inner">
        <span className="checkout-empty-icon">🛍️</span>
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
        <Link to="/products" className="btn btn-gold">Shop Now →</Link>
      </div>
    </div>
  )

  if (success) return (
    <div className="checkout-success">
      <div className="checkout-success-inner">
        <div className="success-icon">✓</div>
        <h2>Order Placed!</h2>
        <p>Thank you for your order, {form.name}. You'll receive a confirmation email shortly.</p>
        <Link to="/" className="btn btn-gold btn-lg">Continue Shopping →</Link>
      </div>
    </div>
  )

  const shippingFee = totalPrice >= 2000 ? 0 : 199
  const total = totalPrice + shippingFee

  return (
    <main className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <Link to="/" className="checkout-logo">
            <img src="/assets/Priority%20Logo-02.png" alt="Priority" onError={e => e.target.style.display='none'} />
          </Link>
          <div className="checkout-steps">
            {['Shipping', 'Review & Pay'].map((s, i) => (
              <div key={s} className={`checkout-step ${step >= i + 1 ? 'active' : ''}`}>
                <span className="step-num">{i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-layout">
          {/* Form */}
          <div className="checkout-form-section">
            {step === 1 && (
              <div>
                <h2 className="checkout-section-title">Shipping Information</h2>
                <div className="checkout-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input name="name" value={form.name} onChange={onChange} placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={onChange} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="form-group">
                    <label>Address *</label>
                    <input name="address" value={form.address} onChange={onChange} placeholder="Street address, apartment, etc." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input name="city" value={form.city} onChange={onChange} placeholder="Mumbai" />
                    </div>
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input name="pincode" value={form.pincode} onChange={onChange} placeholder="400001" />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input name="state" value={form.state} onChange={onChange} placeholder="Maharashtra" />
                    </div>
                  </div>
                  <button className="btn btn-gold btn-lg btn-full"
                    disabled={!form.name || !form.email || !form.phone || !form.address}
                    onClick={() => setStep(2)}>
                    Continue to Review →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="checkout-section-title">Review & Pay</h2>
                <div className="review-address">
                  <h4>Shipping to</h4>
                  <p>{form.name} · {form.phone}</p>
                  <p>{form.address}, {form.city} {form.pincode}, {form.state}</p>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>Edit</button>
                </div>

                <div className="review-items">
                  {cart.map(item => (
                    <div key={item.key} className="review-item">
                      <img src={item.image_url || '/assets/Category/Travelling%20Bag.png'} alt={item.name}
                        onError={e => e.target.src='/assets/Category/Travelling%20Bag.png'} />
                      <div className="review-item-info">
                        <p>{item.name}</p>
                        <span>{item.color} · {item.size} · Qty {item.qty}</span>
                      </div>
                      <span className="review-item-price">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                {error && <div className="checkout-error">{error}</div>}
                <button className="btn btn-gold btn-lg btn-full" onClick={handleOrder} disabled={loading}>
                  {loading ? 'Processing…' : `Pay ${formatCurrency(total)} →`}
                </button>
                <p className="checkout-secure">🔒 Secured by Razorpay · SSL Encrypted</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.key} className="summary-item">
                  <span className="summary-item-name">{item.name} ×{item.qty}</span>
                  <span>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="summary-line"><span>Subtotal</span><span>{formatCurrency(totalPrice)}</span></div>
            <div className="summary-line"><span>Shipping</span><span>{shippingFee === 0 ? <span style={{color:'#4caf7d'}}>Free</span> : formatCurrency(shippingFee)}</span></div>
            <div className="summary-divider" />
            <div className="summary-total"><span>Total</span><span>{formatCurrency(total)}</span></div>
            {totalPrice < 2000 && <p className="free-ship-note">Add {formatCurrency(2000 - totalPrice)} more for free shipping</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
