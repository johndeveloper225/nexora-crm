import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { money } from '../../lib/format'
import type { Deal, DealStage } from '../../types'
import { DealCard } from '../ui/DealCard'

export function PipelineBoard({
  stages,
  deals,
  compact = false,
}: {
  stages: { id: DealStage; label: string }[]
  deals: Deal[]
  compact?: boolean
}) {
  const { moveDeal } = useApp()
  const [over, setOver] = useState<DealStage | null>(null)

  return (
    <div className="kanban" role="list">
      {stages.map((stage) => {
        const column = deals.filter((deal) => deal.stage === stage.id)
        const total = column.reduce((sum, deal) => sum + deal.value, 0)
        return (
          <section
            key={stage.id}
            className={`kanban-col${over === stage.id ? ' drag-over' : ''}`}
            role="listitem"
            aria-label={`${stage.label}, ${column.length} deals`}
            onDragOver={(event) => {
              event.preventDefault()
              setOver(stage.id)
            }}
            onDragLeave={(event) => {
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
              setOver((current) => (current === stage.id ? null : current))
            }}
            onDrop={(event) => {
              event.preventDefault()
              const id = event.dataTransfer.getData('text/plain')
              if (id) moveDeal(id, stage.id)
              setOver(null)
            }}
          >
            <header className="kanban-head">
              <div>
                <h3>{stage.label}</h3>
                <p className="muted">{money(total)}</p>
              </div>
              <span className="count-pill">{column.length}</span>
            </header>
            <div className="kanban-list">
              {column.length === 0 ? <p className="kanban-empty">No deals in this stage.</p> : null}
              {column.map((deal) => (
                <DealCard key={deal.id} deal={deal} compact={compact} onMove={moveDeal} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
