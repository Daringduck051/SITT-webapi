function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Help">
      <div className="modal-panel modal-panel-help">
        <h4>Help</h4>
        <div className="help-copy">
          <p>
            This app helps a support agent count the number of interactions per theme during a
            shift.
          </p>
          <p>
            Use the + and - buttons on each theme to add or remove interaction counts.
          </p>
          <p>
            Add custom themes from the top-left menu using Add Custom Theme.
          </p>
          <p>
            Remove a custom theme from its card menu (⋮) and confirm by typing DELETE.
          </p>
          <p>
            Use Summary to review tally data and Email to send the exported CSV report.
          </p>
          <p>
            Use New Shift in the top-left menu to reset all counts to zero.
          </p>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default HelpModal
