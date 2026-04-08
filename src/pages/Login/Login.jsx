import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../hooks/useApi'
import './Login.css'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register'
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (mode === 'login') {
        login(data.user, data.token)
        navigate('/')
      } else {
        setMode('login')
        setError('')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-bg-media" />
      
      <motion.div 
        className="login-card-atelier"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="login-header">
          <p>The Digital Atelier</p>
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Identity'}</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div 
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="form-group-atelier"
              >
                <label>Full Name</label>
                <input type="text" name="name" value={form.name} onChange={onChange} placeholder="E.g. Alexander Knight" required />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="form-group-atelier">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="your@email.com" required />
          </div>

          <div className="form-group-atelier">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" required />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-login-gold" disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-toggle-text">
          {mode === 'login' ? (
            <>Don't have an account? <span onClick={() => setMode('register')}>Join the Atelier</span></>
          ) : (
            <>Already registered? <span onClick={() => setMode('login')}>Sign In</span></>
          )}
        </div>

        <Link to="/" className="login-back-home">← Return to Storefront</Link>
      </motion.div>
    </main>
  )
}
