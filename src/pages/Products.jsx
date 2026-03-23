import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import './Products.css'

const CATEGORIES = ['All', 'Cabin Luggage', 'Check-in Luggage', 'Luggage Sets', 'Backpacks', 'Accessories']
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'newest', label: 'Newest' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 30000])

  const activeCat = searchParams.get('cat') || 'All'
  const activeSub = searchParams.get('sub') || ''

  useEffect(() => {
    setLoading(true)
    fetch('/api/v1/catalog/products')
      .then(r => r.json())
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const setCat = (cat) => {
    if (cat === 'All') { searchParams.delete('cat'); searchParams.delete('sub') }
    else setSearchParams({ cat })
  }

  let filtered = products
  if (activeCat !== 'All') filtered = filtered.filter(p => p.category === activeCat)
  if (activeSub) filtered = filtered.filter(p => p.sub_category === activeSub)
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase()))
  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  return (
    <main className="products-page">
      {/* Page Hero */}
      <div className="products-hero">
        <div className="container">
          <span className="section-label">Our Collection</span>
          <h1 className="section-title">
            {activeCat === 'All' ? <>All <span>Products</span></> : activeCat}
          </h1>
          <p className="products-hero-sub">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="container products-layout">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <div className="sidebar-section">
            <h3>Categories</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`sidebar-cat-btn ${activeCat === cat ? 'active' : ''}`}
                onClick={() => setCat(cat)}
              >
                {cat}
                <span className="cat-count">
                  {cat === 'All' ? products.length : products.filter(p => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <div className="price-input-wrap">
                <span>₹</span>
                <input type="number" value={priceRange[0]} min={0} max={priceRange[1]}
                  onChange={e => setPriceRange([+e.target.value, priceRange[1]])} />
              </div>
              <span className="price-dash">—</span>
              <div className="price-input-wrap">
                <span>₹</span>
                <input type="number" value={priceRange[1]} min={priceRange[0]} max={50000}
                  onChange={e => setPriceRange([priceRange[0], +e.target.value])} />
              </div>
            </div>
            <input type="range" className="price-slider" min={0} max={30000} step={500}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], +e.target.value])} />
          </div>
        </aside>

        {/* Main */}
        <div className="products-main">
          <div className="products-toolbar">
            <div className="search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text" placeholder="Search products…"
                value={search} onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="products-grid-main">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 360, borderRadius: 16 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <p className="no-results-icon">🔍</p>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term.</p>
              <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setCat('All'); setPriceRange([0, 30000]) }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid-main">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
