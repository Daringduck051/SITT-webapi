function SummaryModal({ isOpen, onClose, onOpenEmail, categories }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Summary">
      <div className="modal-panel modal-panel-summary">
        <h4>Summary</h4>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Theme Name</th>
              <th>Tallies</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Close
          </button>
          <button type="button" onClick={onOpenEmail}>
            Email
          </button>
        </div>
      </div>
    </div>
  )
}

export default SummaryModal
