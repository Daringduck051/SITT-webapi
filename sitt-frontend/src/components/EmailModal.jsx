import { useState } from 'react'

function EmailModal({ isOpen, onClose, onSend }) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSending(true)

    try {
      await onSend({ subject: subject.trim(), body: body.trim() })
      setSubject('')
      setBody('')
      onClose()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to send email.')
    } finally {
      setIsSending(false)
    }
  }

  const handleCancel = () => {
    if (isSending) return
    setSubject('')
    setBody('')
    setErrorMessage('')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Email">
      <div className="modal-panel modal-panel-email">
        <h4>Email</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            maxLength={120}
            required
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message Body"
            rows={6}
          />
          {errorMessage ? <p className="modal-error">{errorMessage}</p> : null}
          <div className="modal-actions">
            <button type="button" onClick={handleCancel} disabled={isSending}>
              Cancel
            </button>
            <button type="submit" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmailModal
