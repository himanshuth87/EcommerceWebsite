import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../hooks/useApi'
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
        setForm(f => ({ ...f, name: '' }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <div className="login-brand">
          <img src="/assets/Priority%20Logo-02.png" alt="Priority Bags" className="login-logo"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span className="login-brand-text">PRIORITY</span>
          <p className="login-tagline">Your journey begins here.</p>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError('') }}>Sign In</button>
          <button className={`login-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError('') }}>Create Account</button>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={onChange}
                placeholder="Your full name" required />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={onChange}
              placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={onChange}
              placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Enter your password'} required />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn btn-gold btn-full btn-lg login-submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="login-alt">
            Don't have an account?{' '}
            <button className="login-link" onClick={() => setMode('register')}>Sign up free</button>
          </p>
        )}
        {mode === 'register' && (
          <p className="login-alt">
            Already have an account?{' '}
            <button className="login-link" onClick={() => setMode('login')}>Sign in</button>
          </p>
        )}

        <Link to="/" className="login-back">← Back to Store</Link>
      </div>
    </main>
  )
}
