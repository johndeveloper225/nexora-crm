export function Logo({ compact = false, word = 'NEXORA' }: { compact?: boolean; word?: string }) {
  return (
    <span className="brand">
      <span className="logo-mark" aria-hidden="true">
        N
      </span>
      {compact ? null : (
        <span className="logo-word">
          <strong>{word}</strong>
          <small>CRM</small>
        </span>
      )}
    </span>
  )
}
