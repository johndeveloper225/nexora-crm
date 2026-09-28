import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../lib/format'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  to?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  to,
  type = 'button',
  ...props
}: Props) {
  const classes = cx('btn', `btn-${variant}`, `btn-${size}`, className)
  if (to) {
    return (
      <Link to={to} className={classes}>
        {icon}
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={classes} {...props}>
      {icon}
      {children}
    </button>
  )
}
