import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'

function Sparkline({ up }: { up: boolean }) {
  const path = up
    ? 'M1 16 L10 14 L18 15 L28 9 L38 10 L48 4 L55 6'
    : 'M1 6 L10 8 L18 7 L28 13 L38 12 L48 17 L55 15'
  return (
    <svg className={up ? 'spark up' : 'spark down'} viewBox="0 0 56 22" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function KpiCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string
  value: string
  delta?: number
  hint?: string
  icon?: ReactNode
}) {
  const up = (delta ?? 0) >= 0
  return (
    <article className="kpi-card">
      <div className="spread">
        <p className="kpi-label">{label}</p>
        {delta !== undefined ? <Sparkline up={up} /> : null}
      </div>
      <p className="kpi-value">{value}</p>
      <div className="kpi-meta">
        {delta !== undefined ? (
          <span className={up ? 'delta up' : 'delta down'}>
            {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {up ? '+' : ''}
            {delta.toFixed(1)}%
          </span>
        ) : null}
        {hint ? <span className="muted">{hint}</span> : null}
      </div>
    </article>
  )
}
