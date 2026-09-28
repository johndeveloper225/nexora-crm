import { BellRing, Briefcase, CheckCircle2, FileBarChart, UserRound, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { NotificationItem } from '../../types'

const icons = {
  lead: UserRound,
  contact: UserRound,
  deal: Briefcase,
  task: CheckCircle2,
  report: FileBarChart,
}

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp()
  if (!open) return null
  const unread = notifications.filter((item) => !item.read).length

  return (
    <div className="notif-panel" role="dialog" aria-label="Notifications">
      <header className="spread">
        <div>
          <strong>Notifications</strong>
          <p className="muted">{unread ? `${unread} unread` : 'You are all caught up'}</p>
        </div>
        <div className="row">
          <button
            type="button"
            className="text-btn"
            onClick={markAllNotificationsRead}
            disabled={unread === 0}
          >
            Mark all read
          </button>
          <button type="button" className="icon-btn" aria-label="Close notifications" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </header>
      <ul className="notif-list">
        {notifications.map((item) => (
          <NotificationRow key={item.id} item={item} onOpen={() => markNotificationRead(item.id)} />
        ))}
      </ul>
    </div>
  )
}

function NotificationRow({ item, onOpen }: { item: NotificationItem; onOpen: () => void }) {
  const Icon = icons[item.type] ?? BellRing
  return (
    <li>
      <button type="button" className={`notif-item${item.read ? '' : ' unread'}`} onClick={onOpen}>
        <span className="notif-icon" aria-hidden="true">
          <Icon size={16} />
        </span>
        <span>
          <strong>{item.title}</strong>
          <small>{item.body}</small>
          <em>{item.time}</em>
        </span>
        {item.read ? null : <span className="dot" aria-label="Unread" />}
      </button>
    </li>
  )
}
