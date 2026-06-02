import { useEffect, useRef, useState } from 'react'
import TallyCard from './components/TallyCard.jsx'
import CustomThemeModal from './components/CustomThemeModal.jsx'
import SummaryModal from './components/SummaryModal.jsx'
import EmailModal from './components/EmailModal.jsx'
import DeleteThemeModal from './components/DeleteThemeModal.jsx'
import HelpModal from './components/HelpModal.jsx'
import ResetShiftModal from './components/ResetShiftModal.jsx'
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import { useAuth } from './context/AuthContext.jsx'
import './App.css'

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'HSI Core', count: 0, isCustom: false },
  { id: 2, name: 'LMS HSI', count: 0, isCustom: false },
  { id: 3, name: 'CMS', count: 0, isCustom: false },
  { id: 4, name: 'EHS', count: 0, isCustom: false },
  { id: 5, name: 'OSHA Support', count: 0, isCustom: false },
]

const toCategory = (note) => ({
  id: note.id,
  name: note.name,
  count: note.count,
  isCustom: note.id > 5,
})

function App() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [isShiftSent, setIsShiftSent] = useState(false)
  const [isCustomThemeOpen, setIsCustomThemeOpen] = useState(false)
  const [isDeleteThemeOpen, setIsDeleteThemeOpen] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isEmailOpen, setIsEmailOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isResetShiftOpen, setIsResetShiftOpen] = useState(false)
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [themePendingDelete, setThemePendingDelete] = useState(null)
  const [authView, setAuthView] = useState('login')
  const actionMenuRef = useRef(null)
  const helpMenuRef = useRef(null)
  const userMenuRef = useRef(null)
  const hasLoadedNotesRef = useRef(false)
  const { isAuthenticated, isLoading, login, logout, userName } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setCategories(DEFAULT_CATEGORIES)
      setIsShiftSent(false)
      hasLoadedNotesRef.current = false
      return
    }

    let isCancelled = false

    const loadNotes = async () => {
      try {
        const response = await fetch('/notes', {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          hasLoadedNotesRef.current = true
          return
        }

        const notes = await response.json()
        if (isCancelled) return

        if (Array.isArray(notes) && notes.length > 0) {
          const sortedNotes = [...notes].sort((a, b) => a.id - b.id)
          setCategories(sortedNotes.map(toCategory))
          setIsShiftSent(Boolean(sortedNotes.some((note) => note.shiftSent)))
        } else {
          setCategories(DEFAULT_CATEGORIES)
          setIsShiftSent(false)
        }
      } catch {
        // Leave defaults when notes cannot be fetched.
      } finally {
        hasLoadedNotesRef.current = true
      }
    }

    loadNotes()

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated || !hasLoadedNotesRef.current) return

    const payload = categories.map((category) => ({
      Id: category.id,
      Name: category.name,
      Count: category.count,
      ShiftSent: isShiftSent,
    }))

    const persistNotes = async () => {
      try {
        await fetch('/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      } catch {
        // Keep UI responsive even if persistence fails temporarily.
      }
    }

    persistNotes()
  }, [categories, isShiftSent, isAuthenticated])

  useEffect(() => {
    if (!isActionMenuOpen) return

    const handleDocumentClick = (event) => {
      if (!actionMenuRef.current) return
      if (!actionMenuRef.current.contains(event.target)) {
        setIsActionMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsActionMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isActionMenuOpen])

  useEffect(() => {
    if (!isHelpMenuOpen) return

    const handleDocumentClick = (event) => {
      if (!helpMenuRef.current) return
      if (!helpMenuRef.current.contains(event.target)) {
        setIsHelpMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsHelpMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isHelpMenuOpen])

  useEffect(() => {
    if (!isUserMenuOpen) return

    const handleDocumentClick = (event) => {
      if (!userMenuRef.current) return
      if (!userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isUserMenuOpen])

  const updateCount = (id, delta) => {
    if (isShiftSent) return

    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== id) return category
        const next = Math.max(0, Math.min(300, category.count + delta))
        return { ...category, count: next }
      }),
    )
  }

  const confirmResetAll = () => {
    setCategories((prev) => prev.map((category) => ({ ...category, count: 0 })))
    setIsShiftSent(false)
    setIsResetShiftOpen(false)
  }

  const openResetShiftModal = () => {
    setIsResetShiftOpen(true)
    setIsActionMenuOpen(false)
  }

  const closeResetShiftModal = () => setIsResetShiftOpen(false)

  const openCustomThemeModal = () => {
    if (isShiftSent) return
    setIsCustomThemeOpen(true)
    setIsActionMenuOpen(false)
  }
  const closeCustomThemeModal = () => setIsCustomThemeOpen(false)

  const openDeleteThemeModal = (theme) => {
    setThemePendingDelete(theme)
    setIsDeleteThemeOpen(true)
  }

  const closeDeleteThemeModal = () => {
    setIsDeleteThemeOpen(false)
    setThemePendingDelete(null)
  }

  const confirmDeleteTheme = (themeId) => {
    setCategories((prev) => prev.filter((item) => item.id !== themeId))
    closeDeleteThemeModal()
  }

  const openSummaryModal = () => {
    setIsSummaryOpen(true)
    setIsActionMenuOpen(false)
  }

  const closeSummaryModal = () => setIsSummaryOpen(false)

  const openEmailModalFromSummary = () => {
    setIsSummaryOpen(false)
    setIsEmailOpen(true)
  }

  const closeEmailModal = () => setIsEmailOpen(false)

  const openHelpModal = () => {
    setIsHelpOpen(true)
    setIsHelpMenuOpen(false)
  }

  const closeHelpModal = () => setIsHelpOpen(false)

  const handleLogout = async () => {
    await logout()
  }

  const buildSummaryCsvBase64 = () => {
    const header = ['Theme Name', 'Tallies']
    const rows = categories.map((item) => [item.name, String(item.count)])
    const csvLines = [header, ...rows].map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','),
    )
    const csvString = csvLines.join('\n')
    return btoa(unescape(encodeURIComponent(csvString)))
  }

  const sendEmail = async ({ subject, body }) => {
    const trimmedSubject = subject.trim()
    if (!trimmedSubject) {
      throw new Error('Subject is required.')
    }

    const dateString = new Date().toLocaleDateString()
    const base64Content = buildSummaryCsvBase64()

    const payload = {
      Subject: trimmedSubject,
      HtmlBody: body.trim(),
      Attachments: [
        {
          Filename: `data_export_${dateString}.csv`,
          Content: base64Content,
          ContentType: 'text/csv',
        },
      ],
    }

    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `Email failed with status ${response.status}`)
    }

    setIsShiftSent(true)
  }

  const saveCustomTheme = (rawName) => {
    if (isShiftSent) return

    const name = rawName.trim()
    if (!name) return

    setCategories((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((item) => item.id)) + 1 : 1

      return [...prev, { id: nextId, name, count: 0, isCustom: true }]
    })

    setIsCustomThemeOpen(false)
  }

  if (isLoading) {
    return <main className="tally-page" />
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterPage onShowLogin={() => setAuthView('login')} />
    }

    return <LoginPage onLogin={login} onShowRegister={() => setAuthView('register')} />
  }

  return (
    <main className="tally-page">
      <header className="tally-navbar">
        <div className="nav-menu-wrap" ref={actionMenuRef}>
          <button
            className="nav-icon"
            type="button"
            aria-label="Actions"
            aria-expanded={isActionMenuOpen}
            onClick={() => setIsActionMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
          {isActionMenuOpen ? (
            <div className="ellipse-menu" role="menu" aria-label="Theme actions">
              <button
                className="ellipse-item"
                type="button"
                onClick={openCustomThemeModal}
                disabled={isShiftSent}
              >
                Add Custom Theme
              </button>
              <button className="ellipse-item" type="button" onClick={openSummaryModal}>
                Summary
              </button>
              <button className="ellipse-item" type="button" onClick={openResetShiftModal}>
                New Shift
              </button>
            </div>
          ) : null}
        </div>
        <h1 className="tally-title">Support Interaction Theme Tally</h1>
        <div className="nav-right-controls">
          <div className="nav-menu-wrap" ref={helpMenuRef}>
            <button
              className="top-icon-btn"
              type="button"
              aria-label="Help"
              aria-expanded={isHelpMenuOpen}
              onClick={() => setIsHelpMenuOpen((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
              </svg>
            </button>
            {isHelpMenuOpen ? (
              <div className="ellipse-menu menu-right" role="menu" aria-label="Help actions">
                <button className="ellipse-item" type="button" onClick={openHelpModal}>
                  Help
                </button>
              </div>
            ) : null}
          </div>

          <div className="nav-menu-wrap" ref={userMenuRef}>
            <button
              className="top-icon-btn"
              type="button"
              aria-label="User"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1z" />
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
            </button>
            {isUserMenuOpen ? (
              <div className="ellipse-menu menu-right user-menu" role="menu" aria-label="User actions">
                <h6 className="user-menu-header">{userName || 'Agent'}</h6>
                <hr className="user-menu-divider" />
                <button className="ellipse-item logout-item" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="orange-bar" />

      <section className="tally-grid">
        {categories.map((category) => (
          <TallyCard
            key={category.id}
            name={category.name}
            count={category.count}
            isCustom={category.isCustom}
            isLocked={isShiftSent}
            onIncrement={() => updateCount(category.id, 1)}
            onDecrement={() => updateCount(category.id, -1)}
            onRequestDelete={() => openDeleteThemeModal(category)}
          />
        ))}
      </section>

      <CustomThemeModal
        isOpen={isCustomThemeOpen}
        onClose={closeCustomThemeModal}
        onSave={saveCustomTheme}
      />

      <SummaryModal
        isOpen={isSummaryOpen}
        onClose={closeSummaryModal}
        onOpenEmail={openEmailModalFromSummary}
        categories={categories}
      />

      <EmailModal
        isOpen={isEmailOpen}
        onClose={closeEmailModal}
        onSend={sendEmail}
      />

      <DeleteThemeModal
        isOpen={isDeleteThemeOpen}
        themeName={themePendingDelete?.name ?? ''}
        onClose={closeDeleteThemeModal}
        onConfirm={() => confirmDeleteTheme(themePendingDelete?.id)}
      />

      <HelpModal isOpen={isHelpOpen} onClose={closeHelpModal} />

      <ResetShiftModal
        isOpen={isResetShiftOpen}
        onClose={closeResetShiftModal}
        onConfirm={confirmResetAll}
      />
    </main>
  )
}

export default App
