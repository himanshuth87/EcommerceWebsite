import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, apiFetch } from '../../hooks/useApi'
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
  const [payMethod, setPayMethod] = useState('razorpay') // 'razorpay', 'cod', 'upi'

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Full name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email is required'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) return 'Valid 10-digit Indian phone number is required'
    if (!form.address.trim()) return 'Address is required'
    if (!form.city.trim()) return 'City is required'
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) return 'Valid 6-digit pincode is required'
    if (!form.state.trim()) return 'State is required'
    return null
  }

  const handleStep1Continue = () => {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
  }

  const handleOrder = async () => {
    if (payMethod === 'cod') {
      return handleCodOrder()
    }

    setLoading(true)
    setError('')
    try {
      const orderData = await apiFetch('/api/v1/orders/create', {
        method: 'POST',
        body: JSON.stringify({ amount: total, customerName: form.name, email: form.email, phone: form.phone }),
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Priority Bags",
        description: "The Digital Atelier Checkout",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            await apiFetch('/api/v1/orders/verify', {
              method: 'POST',
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })
            clearCart()
            setSuccess(true)
          } catch {
            setError('Payment verification failed. Please contact support.')
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#c9a84c" }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError('Payment initiation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCodOrder = async () => {
    setLoading(true)
    setError('')
    try {
      // In a real app, you'd call an endpoint like '/api/create-order-cod'
      // For now we'll simulate success for COD
      await new Promise(r => setTimeout(r, 1500))
      clearCart()
      setSuccess(true)
    } catch (err) {
      setError('Failed to process order. Please try again.')
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
                  {error && <div className="checkout-error">{error}</div>}
                  <button className="btn btn-gold btn-lg btn-full" onClick={handleStep1Continue}>
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

                <div className="payment-selection">
                  <h4>Choose Payment Method</h4>
                  <div className={`pay-option ${payMethod === 'razorpay' ? 'active' : ''}`} onClick={() => setPayMethod('razorpay')}>
                    <span className="material-symbols-outlined">credit_card</span>
                    <div>
                      <p>Razorpay (Card/Netbanking/UPI)</p>
                      <span>Standard Transaction Fees Apply</span>
                    </div>
                  </div>
                  
                  <div className={`pay-option ${payMethod === 'cod' ? 'active' : ''}`} onClick={() => setPayMethod('cod')}>
                    <span className="material-symbols-outlined">payments</span>
                    <div>
                      <p>Cash on Delivery (Standard)</p>
                      <span>No Online Payment Required — FREE</span>
                    </div>
                  </div>

                  <div className="upi-direct-note">
                    <p>💡 Tip: For <strong>0% Transaction Fees</strong>, select UPI inside the Razorpay modal or ask about our Direct QR flow.</p>
                  </div>
                </div>

                {error && <div className="checkout-error">{error}</div>}
                <button className="btn btn-gold btn-lg btn-full" onClick={handleOrder} disabled={loading}>
                  {loading ? 'Processing…' : payMethod === 'cod' ? 'Complete Order' : `Pay ${formatCurrency(total)} →`}
                </button>
                <p className="checkout-secure">🔒 Secure checkout · SSL Encrypted</p>
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
