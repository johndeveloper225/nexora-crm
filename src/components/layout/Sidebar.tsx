import {
  BarChart3,
  Building2,
  CalendarDays,
  CircleHelp,
  Handshake,
  LayoutDashboard,
  ListChecks,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useMediaQuery } from '../../lib/hooks'
import { cx } from '../../lib/format'
import { Logo } from '../ui/Logo'

const primary = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/deals', label: 'Deals', icon: Handshake },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

const secondary = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help', icon: CircleHelp },
]

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileNavOpen, setMobileNavOpen } = useApp()
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const collapsed = sidebarCollapsed && !isMobile

  return (
    <>
      <button
        type="button"
        className={cx('sidebar-backdrop', mobileNavOpen && 'show')}
        aria-label="Close menu"
        tabIndex={mobileNavOpen ? 0 : -1}
        onClick={() => setMobileNavOpen(false)}
      />
      <aside
        className={cx('sidebar', collapsed && 'collapsed', mobileNavOpen && 'open')}
        aria-label="Primary"
        inert={isMobile && !mobileNavOpen ? true : undefined}
      >
        <div className="sidebar-top">
          <NavLink to="/dashboard" className="brand-link" aria-label="NEXORA home">
            <Logo compact={collapsed} />
          </NavLink>
          <button
            type="button"
            className="icon-btn mobile-only"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <p className="nav-section">Workspace</p>
        <nav className="sidebar-scroll" aria-label="Workspace">
          {primary.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) => cx('nav-link', isActive && 'active')}
              onClick={() => setMobileNavOpen(false)}
            >
              <item.icon size={18} />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p className="nav-section">Account</p>
          {secondary.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) => cx('nav-link', isActive && 'active')}
              onClick={() => setMobileNavOpen(false)}
            >
              <item.icon size={18} />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            className="nav-link collapse-toggle desktop-only"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            <span className="nav-label">Collapse</span>
          </button>
        </div>
      </aside>
    </>
  )
}
