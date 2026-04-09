import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import CartDrawer from './components/common/CartDrawer'
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Checkout from './pages/Checkout/Checkout'
import Login from './pages/Login/Login'
import Account from './pages/Account/Account'
import Premium from './pages/Premium/Premium'
import Admin from './pages/Admin/Admin'
import About from './pages/About/About'
import BotDashboard from './pages/BotDashboard/BotDashboard'

import { useEffect } from 'react'
import './styles/globals.css'

function AppRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
    const observerOptions = { threshold: 0.1 }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active') })
    }, observerOptions)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left')
    revealElements.forEach(el => observer.observe(el))
    return () => revealElements.forEach(el => observer.unobserve(el))
  }, [location.pathname])

  return (
    <>
      {!isAdmin && <Navbar />}
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/bot-dashboard" element={<ProtectedRoute><BotDashboard /></ProtectedRoute>} />
        <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
