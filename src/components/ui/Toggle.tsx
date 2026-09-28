import { cx } from '../../lib/format'

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cx('switch', checked && 'on')}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  )
}
