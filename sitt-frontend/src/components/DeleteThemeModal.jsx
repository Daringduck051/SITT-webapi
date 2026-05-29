import { useEffect, useState } from 'react'

function DeleteThemeModal({ isOpen, themeName, onClose, onConfirm }) {
  const [confirmationText, setConfirmationText] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const canDelete = confirmationText.trim().toUpperCase() === 'DELETE'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canDelete) return
    onConfirm()
    setConfirmationText('')
  }

  const handleCancel = () => {
    setConfirmationText('')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Delete custom theme">
      <div className="modal-panel">
        <h4>Delete Custom Theme</h4>
        <p className="delete-helper">
          Type DELETE to remove <strong>{themeName}</strong>.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type DELETE"
            maxLength={6}
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" disabled={!canDelete}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteThemeModal
