import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

async function fetchSession() {
  const response = await fetch('/api/account/session', {
    method: 'GET',
    credentials: 'include',
  })

  if (response.status === 401) {
    return { isAuthenticated: false, userName: '' }
  }

  if (!response.ok) {
    throw new Error(`Failed to validate session: ${response.status}`)
  }

  const payload = await response.json()
  return {
    isAuthenticated: Boolean(payload?.isAuthenticated),
    userName: payload?.userName ?? '',
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const checkSession = useCallback(async () => {
    setIsLoading(true)
    try {
      const session = await fetchSession()
      setIsAuthenticated(session.isAuthenticated)
      setUserName(session.userName)
      return session.isAuthenticated
    } catch {
      setIsAuthenticated(false)
      setUserName('')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  const login = useCallback(
    async ({ username, password }) => {
      const trimmedUsername = username?.trim()
      if (!trimmedUsername || !password) {
        return { success: false, message: 'Username and password are required.' }
      }

      try {
        const response = await fetch('/api/account/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ Username: trimmedUsername, Password: password }),
        })

        if (!response.ok) {
          if (response.status === 401) {
            return { success: false, message: 'Invalid username or password.' }
          }

          return { success: false, message: 'Login failed. Please try again.' }
        }

        await checkSession()
        return { success: true }
      } catch {
        return { success: false, message: 'Unable to reach the server.' }
      }
    },
    [checkSession],
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/account/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setIsAuthenticated(false)
      setUserName('')
    }
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      userName,
      isLoading,
      checkSession,
      login,
      logout,
    }),
    [checkSession, isAuthenticated, isLoading, login, logout, userName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
