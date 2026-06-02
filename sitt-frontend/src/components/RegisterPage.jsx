import { useState } from 'react'

function isPasswordValid(password) {
  if (password.length < 8) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  if (!/[^a-zA-Z0-9]/.test(password)) return false
  return true
}

function RegisterPage({ onShowLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const passwordValid = isPasswordValid(password)
  const passwordsMatch = password.length > 0 && password === confirmPassword

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')

    if (!passwordValid) {
      setSubmitError('Password is not valid.')
      return
    }

    if (!passwordsMatch) {
      setSubmitError("Passwords don't match.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          Username: username.trim(),
          Email: email.trim(),
          Password: password,
        }),
      })

      if (!response.ok) {
        setSubmitError('Username taken or invalid password.')
        return
      }

      setSubmitSuccess('Account created successfully. You can now log in.')
      setPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        onShowLogin()
      }, 800)
    } catch {
      setSubmitError('Unable to create account right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="tally-page login-page">
      <header className="tally-navbar login-navbar">
        <h1 className="tally-title login-title">Support - Create Account</h1>
      </header>
      <div className="orange-bar" />

      <section className="login-shell" aria-label="Create account form">
        <form className="login-card register-card" onSubmit={handleSubmit} autoComplete="off">
          <div className="register-inline-inputs">
            <input
              type="text"
              placeholder="Username (Required)"
              minLength={6}
              maxLength={64}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email (Required)"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="password-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (Required)"
              minLength={8}
              maxLength={64}
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

          <div className="password-input-wrap">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password (Required)"
              minLength={8}
              maxLength={64}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {!passwordValid && password.length > 0 ? (
            <p className="login-error">Password is not valid.</p>
          ) : null}

          {!passwordsMatch && confirmPassword.length > 0 ? (
            <p className="login-error">Passwords don't match.</p>
          ) : null}

          {submitError ? <p className="login-error">{submitError}</p> : null}
          {submitSuccess ? <p className="login-success">{submitSuccess}</p> : null}

          <button type="submit" className="login-submit register-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <button
            type="button"
            className="login-link login-link-button"
            onClick={onShowLogin}
          >
            Have account? Login
          </button>
        </form>
      </section>
    </main>
  )
}

export default RegisterPage
