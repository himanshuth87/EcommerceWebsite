import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import './Products.css'

const CATEGORY_MAP = {
  'Luggage': ['Duffle', 'Trekking', 'Hard Luggage'],
  'Backpack': ['School', 'College', 'Laptop'],
  'Accessories': ['Pouches', 'Lunch Bags', 'Shopping Bag']
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
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
    if (cat === 'All') {
      searchParams.delete('cat')
      searchParams.delete('sub')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ cat })
    }
  }

  const setSub = (sub) => {
    setSearchParams({ cat: activeCat, sub })
  }

  let filtered = products
  if (activeCat !== 'All') filtered = filtered.filter(p => p.category === activeCat)
  if (activeSub) filtered = filtered.filter(p => p.sub_category === activeSub)
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase()))
  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    return 0
  })

  return (
    <main className="products-page">
      <div className="products-hero">
        <div className="container">
          <span className="section-label">Inventory</span>
          <h1 className="section-title">
            {activeCat === 'All' ? 'Our Collection' : activeCat}
            {activeSub && <span className="sub-title"> / {activeSub}</span>}
          </h1>
          <p className="products-hero-sub">{filtered.length} items matched</p>
        </div>
      </div>

      <div className="container products-layout">
        <aside className="products-sidebar">
          <div className="sidebar-section">
            <h3>Categories</h3>
            <button className={`sidebar-cat-btn ${activeCat === 'All' ? 'active' : ''}`} onClick={() => setCat('All')}>
              All Products
            </button>
            {Object.keys(CATEGORY_MAP).map(cat => (
              <div key={cat} className="sidebar-cat-group">
                <button
                  className={`sidebar-cat-btn ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setCat(cat)}
                >
                  {cat}
                </button>
                {activeCat === cat && (
                  <div className="sidebar-sub-list">
                    {CATEGORY_MAP[cat].map(sub => (
                      <button
                        key={sub}
                        className={`sub-cat-btn ${activeSub === sub ? 'active' : ''}`}
                        onClick={() => setSub(sub)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
               <div className="price-box">₹{priceRange[0]}</div>
               <span className="dash">—</span>
               <div className="price-box">₹{priceRange[1]}</div>
            </div>
            <input type="range" className="price-slider" min={0} max={30000} step={500}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], +e.target.value])} />
          </div>
        </aside>

        <div className="products-main">
          <div className="products-toolbar">
            <div className="search-wrap">
              <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
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
              <h3>No products found</h3>
              <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setCat('All'); setPriceRange([0, 30000]) }}>Clear All</button>
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
