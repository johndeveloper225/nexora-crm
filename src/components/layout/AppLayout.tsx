import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { SearchModal } from './SearchModal'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const { setSearchOpen, setMobileNavOpen } = useApp()
  const location = useLocation()

  useEffect(() => {
    setMobileNavOpen(false)
    setSearchOpen(false)
  }, [location.pathname, setMobileNavOpen, setSearchOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sidebar />
      <div className="main-col">
        <Topbar />
        <main id="main" className="content">
          <Outlet />
        </main>
      </div>
      <SearchModal />
    </div>
  )
}
