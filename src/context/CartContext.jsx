import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pb_cart') || '[]') } catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('pb_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, color, size, qty = 1) => {
    const c = color || (product.colors?.[0]) || 'Default'
    const s = size || (product.sizes?.[0]) || 'One Size'
    const key = `${product.id}_${c}_${s}`
    setCart(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { key, id: product.id, name: product.name, price: product.price, image_url: product.image_url, color: c, size: s, qty }]
    })
  }

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key))

  const updateQty = (key, delta) => {
    setCart(prev => prev.map(i => {
      if (i.key !== key) return i
      const newQty = i.qty + delta
      return newQty <= 0 ? null : { ...i, qty: newQty }
    }).filter(Boolean))
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
