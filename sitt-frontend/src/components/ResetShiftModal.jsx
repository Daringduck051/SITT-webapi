function ResetShiftModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Reset tallies">
      <div className="modal-panel">
        <h4>Start New Shift?</h4>
        <p>This resets all tally counts to zero.</p>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="danger-btn" onClick={onConfirm}>
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetShiftModal
