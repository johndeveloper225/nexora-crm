import type { ReactNode } from 'react'

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  summary,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  summary?: string
}) {
  return (
    <section className="card chart-card">
      <div className="card-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {summary ? <p className="sr-only">{summary}</p> : null}
      <div className="chart-body">{children}</div>
    </section>
  )
}
