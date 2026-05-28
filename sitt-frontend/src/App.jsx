import { useState } from 'react'
import TallyCard from './components/TallyCard.jsx'
import './App.css'

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'HSI Core', count: 0 },
  { id: 2, name: 'LMS HSI', count: 0 },
  { id: 3, name: 'CMS', count: 0 },
  { id: 4, name: 'EHS', count: 0 },
  { id: 5, name: 'OSHA Support', count: 0 },
]

function App() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  const updateCount = (id, delta) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== id) return category
        const next = Math.max(0, Math.min(300, category.count + delta))
        return { ...category, count: next }
      }),
    )
  }

  const resetAll = () => {
    setCategories((prev) => prev.map((category) => ({ ...category, count: 0 })))
  }

  return (
    <main className="tally-page">
      <header className="tally-navbar">
        <button className="nav-icon" type="button" aria-label="Menu">
          ☰
        </button>
        <h1 className="tally-title">Support Interaction Theme Tally</h1>
        <button className="reset-btn" type="button" onClick={resetAll}>
          New Shift
        </button>
      </header>

      <div className="orange-bar" />

      <section className="tally-grid">
        {categories.map((category) => (
          <TallyCard
            key={category.id}
            name={category.name}
            count={category.count}
            onIncrement={() => updateCount(category.id, 1)}
            onDecrement={() => updateCount(category.id, -1)}
          />
        ))}
      </section>
    </main>
  )
}

export default App
