const BASE = import.meta.env.VITE_API_URL || ''

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('pb_token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const formatCurrency = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export const getBadgeClass = (badge) => {
  const map = {
    Sale: 'badge-sale', New: 'badge-new', Bestseller: 'badge-bestseller',
    Premium: 'badge-premium', Limited: 'badge-limited', Exclusive: 'badge-exclusive',
    'Best Value': 'badge-value', Bundle: 'badge-sale'
  }
  return map[badge] || 'badge-new'
}

export const getStars = (rating) => {
  const r = parseFloat(rating) || 0
  const full = Math.floor(r)
  const half = r % 1 >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half)
}

export const calcDiscount = (original, price) => {
  if (!original || original <= price) return null
  return Math.round(((original - price) / original) * 100)
}

export const COLOR_MAP = {
  'Midnight Black': '#1a1a2e', 'Arctic White': '#f8f9fa', 'Navy Blue': '#1e3a8a',
  'Rose Gold': '#c8a882', 'Graphite Grey': '#4b5563', 'Ocean Blue': '#0ea5e9',
  'Forest Green': '#16a34a', 'Burgundy': '#9f1239', 'Black': '#1a1a1a',
  'Khaki': '#c6a96d', 'Dark Red': '#991b1b', 'Slate Blue': '#475569',
  'Classic Black': '#111827', 'Champagne Gold': '#d4a853', 'Midnight Navy': '#1e3a8a',
  'Matte Black': '#2d2d2d', 'Silver': '#9ca3af', 'Cobalt Blue': '#2563eb',
  'Coral Red': '#ef4444', 'Olive Green': '#65a30d', 'Navy': '#1e40af',
  'Grey': '#6b7280', 'Gunmetal': '#374151', 'Polished Silver': '#d1d5db',
  'Brown Tan': '#a57c52', 'Charcoal': '#374151',
}
