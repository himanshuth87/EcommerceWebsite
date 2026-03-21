import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Account from './pages/Account'
import About from './pages/About'
import Premium from './pages/Premium'
import { useEffect } from 'react'
import CustomCursor from './components/CustomCursor'
import './styles/globals.css'

export default function App() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, observerOptions)

    const revealElements = document.querySelectorAll('.reveal, .reveal-left')
    revealElements.forEach(el => observer.observe(el))

    return () => revealElements.forEach(el => observer.unobserve(el))
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="noise-overlay" />
          <CustomCursor />
          <Navbar />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/premium" element={<Premium />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
