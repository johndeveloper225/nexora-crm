import type { Deal, DealStage } from '../../types'
import { formatDateShort, money } from '../../lib/format'
import { Avatar } from '../ui/Avatar'
import { DEAL_STAGES } from '../../types'

export function DealCard({
  deal,
  compact = false,
  onMove,
}: {
  deal: Deal
  compact?: boolean
  onMove: (id: string, stage: DealStage) => void
}) {
  return (
    <article
      className={`deal-card${deal.stage === 'Lost' ? ' is-lost' : ''}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', deal.id)
        event.dataTransfer.effectAllowed = 'move'
      }}
    >
      <header className="spread">
        <strong>{compact ? deal.company : deal.name}</strong>
        <span className="deal-value">{money(deal.value)}</span>
      </header>
      <p className="muted deal-company">{compact ? deal.name : deal.company}</p>
      <div className="prob">
        <div className="spread">
          <span>Probability</span>
          <span>{deal.probability}%</span>
        </div>
        <div className="prob-bar" aria-hidden="true">
          <span style={{ width: `${deal.probability}%` }} data-level={deal.probability >= 70 ? 'high' : deal.probability >= 40 ? 'mid' : 'low'} />
        </div>
      </div>
      {compact ? null : (
        <footer className="deal-foot">
          <span className="row">
            <Avatar name={deal.owner} size="sm" alt="" />
            <span>{deal.owner.split(' ')[0]}</span>
          </span>
          <time dateTime={deal.expectedClose}>{formatDateShort(deal.expectedClose)}</time>
        </footer>
      )}
      <label className="sr-only" htmlFor={`stage-${deal.id}`}>
        Move {deal.name} to another stage
      </label>
      <select
        id={`stage-${deal.id}`}
        className="input stage-select"
        value={deal.stage}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => onMove(deal.id, event.target.value as DealStage)}
      >
        {DEAL_STAGES.map((stage) => (
          <option key={stage} value={stage}>
            {stage === 'Won' ? 'Closed Won' : stage === 'Lost' ? 'Closed Lost' : stage}
          </option>
        ))}
      </select>
    </article>
  )
}
