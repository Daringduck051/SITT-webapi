import { useState } from 'react'

function CustomThemeModal({ isOpen, onClose, onSave }) {
  const [themeName, setThemeName] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = themeName.trim()
    if (!trimmed) return
    onSave(trimmed)
    setThemeName('')
  }

  const handleCancel = () => {
    setThemeName('')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <h4>Enter a Custom Theme Name</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            maxLength={30}
            placeholder="Enter a custom theme"
            required
          />
          <div className="modal-actions">
            <button type="submit" className="success-btn">Save</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomThemeModal
