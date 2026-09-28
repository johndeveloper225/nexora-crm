import type { ReactNode } from 'react'
import { cx } from '../../lib/format'

const tones = {
  success: 'badge-success',
  warning: 'badge-warning',
  info: 'badge-info',
  danger: 'badge-danger',
  neutral: 'badge-neutral',
} as const

export type BadgeTone = keyof typeof tones

const statusTone: Record<string, BadgeTone> = {
  Customer: 'success',
  Won: 'success',
  Lead: 'info',
  Qualified: 'info',
  Prospect: 'warning',
  Proposal: 'warning',
  Negotiation: 'neutral',
  High: 'danger',
  Lost: 'danger',
  Medium: 'warning',
  Low: 'neutral',
  meeting: 'info',
  task: 'neutral',
  'follow-up': 'warning',
}

export function Badge({
  children,
  tone,
}: {
  children: ReactNode
  tone?: BadgeTone | string
}) {
  const resolved =
    tone && tone in tones ? (tone as BadgeTone) : statusTone[String(tone ?? children)] ?? 'neutral'
  return <span className={cx('badge', tones[resolved])}>{children}</span>
}
