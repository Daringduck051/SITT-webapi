import { useEffect, useState } from 'react'

function App() {
  const [rawJson, setRawJson] = useState('Loading...')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await fetch('/notes')
        const text = await response.text()

        if (!response.ok) {
          setError(`Request failed: ${response.status} ${response.statusText}`)
          setRawJson(text || '(empty response body)')
          return
        }

        setRawJson(text || '(empty response body)')
      } catch (err) {
        setError(`Network error: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    loadNotes()
  }, [])

  return (
    <main style={{ padding: '1rem', fontFamily: 'monospace' }}>
      <h1>Notes API Test</h1>
      <p>GET /notes via Vite proxy</p>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <pre style={{ whiteSpace: 'pre-wrap' }}>{rawJson}</pre>
    </main>
  )
}

export default App
