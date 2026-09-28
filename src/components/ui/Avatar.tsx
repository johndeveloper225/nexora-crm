import { colorFromName, cx, initials } from '../../lib/format'

export function Avatar({
  name,
  src,
  size = 'md',
  alt,
}: {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  alt?: string
}) {
  if (src) {
    return <img className={cx('avatar', `avatar-${size}`)} src={src} alt={alt ?? name} />
  }
  return (
    <span
      className={cx('avatar', `avatar-${size}`)}
      style={{ background: colorFromName(name) }}
      aria-hidden={alt === '' ? true : undefined}
      title={name}
    >
      {initials(name)}
    </span>
  )
}
