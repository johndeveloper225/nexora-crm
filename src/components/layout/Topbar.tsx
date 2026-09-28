import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Settings, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { fullName } from '../../lib/format'
import { Avatar } from '../ui/Avatar'
import { Dropdown } from '../ui/Dropdown'
import { NotificationPanel } from './NotificationPanel'

export function Topbar() {
  const {
    profile,
    theme,
    setTheme,
    setMobileNavOpen,
    setSearchOpen,
    notifications,
    pushToast,
  } = useApp()
  const navigate = useNavigate()
  const [notesOpen, setNotesOpen] = useState(false)
  const notesRef = useRef<HTMLDivElement>(null)
  const unread = notifications.filter((item) => !item.read).length
  const name = fullName(profile)

  useEffect(() => {
    if (!notesOpen) return
    const onPointer = (event: MouseEvent) => {
      if (!notesRef.current?.contains(event.target as Node)) setNotesOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotesOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [notesOpen])

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn mobile-only"
        aria-label="Open menu"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu size={18} />
      </button>
      <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)}>
        <Search size={16} />
        <span>Search contacts, companies, deals, tasks</span>
        <kbd>Ctrl K</kbd>
      </button>
      <div className="topbar-actions">
        <div className="notif-wrap" ref={notesRef}>
          <button
            type="button"
            className="icon-btn bell-btn"
            aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
            aria-expanded={notesOpen}
            onClick={() => setNotesOpen((open) => !open)}
          >
            <Bell size={18} />
            {unread > 0 ? <span className="bell-count">{unread}</span> : null}
          </button>
          <NotificationPanel open={notesOpen} onClose={() => setNotesOpen(false)} />
        </div>
        <Dropdown
          label="Account menu"
          trigger={(open) => (
            <button type="button" className="user-trigger" aria-haspopup="menu" aria-expanded={open}>
              <Avatar name={name} src={profile.avatarUrl || undefined} size="sm" alt="" />
              <span className="user-meta">
                <strong>{name}</strong>
                <small>{profile.role}</small>
              </span>
              <ChevronDown size={16} className="user-chevron" />
            </button>
          )}
          items={[
            {
              id: 'settings',
              label: 'Profile settings',
              icon: <Settings size={16} />,
              onClick: () => navigate('/settings'),
            },
            {
              id: 'theme',
              label: theme === 'dark' ? 'Light mode' : 'Dark mode',
              icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
              onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
            },
            {
              id: 'signout',
              label: 'Sign out',
              icon: <LogOut size={16} />,
              onClick: () => pushToast('This preview does not include authentication.', 'info'),
            },
          ]}
        />
      </div>
    </header>
  )
}
