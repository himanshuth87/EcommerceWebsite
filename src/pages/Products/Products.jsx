import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../../components/common/ProductCard'
import { apiFetch } from '../../hooks/useApi'
import './Products.css'

const CATEGORY_MAP = {
  'Backpack': ['Laptop', 'School', 'College', 'Trekking', 'Overnight'],
  'Luggage': ['Soft Luggage', 'Hard Luggage'],
  'Accessories': ['Duffle', 'Side Bags', 'Shopping Bag', 'Lunch Bags', 'Pouches'],
  'Kids': []
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 30000])

  const activeCat = searchParams.get('cat') || 'All'
  const activeSub = searchParams.get('sub') || ''

  useEffect(() => {
    setLoading(true)
    apiFetch('/api/v1/catalog/products')
      .then(d => { setProducts(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const setCat = (cat) => {
    if (cat === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ cat })
    }
  }

  const setSub = (sub) => {
    if (!sub) {
      setSearchParams({ cat: activeCat })
    } else {
      setSearchParams({ cat: activeCat, sub })
    }
  }

  const subOptions = (CATEGORY_MAP[activeCat] || [])

  let filtered = products
  if (activeCat !== 'All') filtered = filtered.filter(p => p.category === activeCat)
  if (activeSub) filtered = filtered.filter(p => p.sub_category === activeSub)
  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

  return (
    <main className="products-atelier section-pad" data-theme="dark">
      <div className="container">
        <header className="catalog-header">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="label-sm gold-gradient-text editorial-header">The Catalog</span>
            <h1 className="editorial-header display-sm">
              {activeCat === 'All' ? 'Signature Collection' : activeCat}
              {activeSub && <span className="title-sub"> · {activeSub}</span>}
            </h1>
          </motion.div>
          <div className="catalog-meta label-xs">
            {filtered.length} ARCHIVES FOUND
          </div>
        </header>

        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <div className="sidebar-group">
              <h4 className="label-sm gold-gradient-text">Classification</h4>
              <button 
                className={`filter-btn label-xs ${activeCat === 'All' ? 'active' : ''}`}
                onClick={() => setCat('All')}
              >
                All Releases
              </button>
              {Object.keys(CATEGORY_MAP).map(cat => (
                <button
                  key={cat}
                  className={`filter-btn label-xs ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {subOptions.length > 0 && (
              <div className="sidebar-group">
                <h4 className="label-sm gold-gradient-text">Type</h4>
                <button
                  className={`filter-btn label-xs ${!activeSub ? 'active' : ''}`}
                  onClick={() => setSub('')}
                >
                  All {activeCat}
                </button>
                {subOptions.map(sub => (
                  <button
                    key={sub}
                    className={`filter-btn label-xs ${activeSub === sub ? 'active' : ''}`}
                    onClick={() => setSub(sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            <div className="sidebar-group">
              <h4 className="label-sm gold-gradient-text">Parameters</h4>
              <div className="price-filter">
                <div className="label-xs">Max Value: ₹{priceRange[1].toLocaleString()}</div>
                <input 
                  type="range" 
                  min={0} 
                  max={30000} 
                  step={1000}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, +e.target.value])}
                />
              </div>
            </div>
          </aside>

          <div className="catalog-main">
            {loading ? (
              <div className="catalog-grid">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton catalog-skeleton" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="no-archives">
                <h3 className="editorial-header">No Archive Found</h3>
                <p className="body-sm opacity-50">Adjust your parameters and search once more.</p>
                <button className="btn btn-outline" onClick={() => { setSearchParams({}); setPriceRange([0, 30000]) }}>Reset Catalog</button>
              </div>
            ) : (
              <motion.div 
                className="catalog-grid"
                layout
              >
                <AnimatePresence>
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

