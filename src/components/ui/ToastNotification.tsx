import { Check, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function ToastNotification() {
  const { toasts, dismissToast } = useApp()
  if (toasts.length === 0) return null

  return (
    <div className="toast-stack" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`} role="status">
          <span className="toast-icon" aria-hidden="true">
            <Check size={14} />
          </span>
          <p>{toast.message}</p>
          {toast.undo ? (
            <button
              type="button"
              className="toast-undo"
              onClick={() => {
                toast.undo?.()
                dismissToast(toast.id)
              }}
            >
              Undo
            </button>
          ) : null}
          <button
            type="button"
            className="icon-btn toast-close"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
