import { useState } from 'react'

function LoginPage({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [forgotUsername, setForgotUsername] = useState('')
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')
  const [forgotError, setForgotError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoginError('')
    setIsSubmitting(true)

    try {
      const result = await onLogin({ username: username.trim(), password })
      if (!result?.success) {
        setLoginError(result?.message || 'Invalid username or password.')
        return
      }

      setPassword('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openForgot = () => {
    setForgotUsername('')
    setForgotMessage('')
    setForgotError('')
    setIsForgotOpen(true)
  }

  const closeForgot = () => {
    if (isForgotSubmitting) return
    setIsForgotOpen(false)
    setForgotUsername('')
    setForgotMessage('')
    setForgotError('')
  }

  const handleForgotSubmit = async (event) => {
    event.preventDefault()

    const candidate = forgotUsername.trim()
    if (!candidate) {
      setForgotError('Username is required.')
      return
    }

    setForgotError('')
    setForgotMessage('')
    setIsForgotSubmitting(true)

    try {
      const response = await fetch('/api/account/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ Username: candidate }),
      })

      if (!response.ok) {
        setForgotError('Unable to start account recovery right now. Please try again.')
        return
      }

      setForgotMessage(
        'If an account exists, an email has been sent with instructions to reset your password.',
      )
    } catch {
      setForgotError('Unable to start account recovery right now. Please try again.')
    } finally {
      setIsForgotSubmitting(false)
    }
  }

  return (
    <main className="tally-page login-page">
      <header className="tally-navbar login-navbar">
        <h1 className="tally-title login-title">Support - Sign In</h1>
      </header>
      <div className="orange-bar" />

      <section className="login-shell" aria-label="Login form">
        <form className="login-card" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            maxLength={20}
            required
          />

          <div className="password-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>

          {loginError ? <p className="login-error">{loginError}</p> : null}

          <button
            type="button"
            className="login-link login-link-button"
            onClick={onShowRegister}
          >
            Don't have account? Create one
          </button>

          <button
            type="button"
            className="login-link login-link-button"
            onClick={openForgot}
          >
            Forgot Username or Password?
          </button>
        </form>
      </section>

      {isForgotOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Account recovery">
          <div className="modal-panel login-forgot-panel">
            <h4>Account Recovery</h4>
            <p>Enter username:</p>
            <form onSubmit={handleForgotSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={forgotUsername}
                onChange={(event) => setForgotUsername(event.target.value)}
                maxLength={20}
                required
              />
              {forgotMessage ? <p className="forgot-success">{forgotMessage}</p> : null}
              {forgotError ? <p className="modal-error">{forgotError}</p> : null}
              <div className="modal-actions">
                <button type="button" onClick={closeForgot} disabled={isForgotSubmitting}>
                  {forgotMessage ? 'Close' : 'Cancel'}
                </button>
                <button type="submit" disabled={isForgotSubmitting}>
                  {isForgotSubmitting ? 'Sending...' : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default LoginPage
