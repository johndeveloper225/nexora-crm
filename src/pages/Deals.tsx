import { Handshake, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DealModal } from '../components/deals/DealModal'
import { PipelineBoard } from '../components/deals/PipelineBoard'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Toggle } from '../components/ui/Toggle'
import { useApp } from '../context/AppContext'
import { usePageTitle } from '../lib/hooks'
import type { DealStage } from '../types'

const baseStages: { id: DealStage; label: string }[] = [
  { id: 'New Lead', label: 'New Lead' },
  { id: 'Qualified', label: 'Qualified' },
  { id: 'Proposal', label: 'Proposal' },
  { id: 'Negotiation', label: 'Negotiation' },
  { id: 'Won', label: 'Won' },
]

export function Deals() {
  const { deals } = useApp()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [showLost, setShowLost] = useState(false)
  const [open, setOpen] = useState(false)
  usePageTitle('Deals · NEXORA CRM')

  useEffect(() => {
    setQuery(params.get('q') ?? '')
  }, [params])

  const stages = showLost ? [...baseStages, { id: 'Lost' as const, label: 'Closed Lost' }] : baseStages
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return deals.filter((deal) => {
      if (!showLost && deal.stage === 'Lost') return false
      return `${deal.name} ${deal.company} ${deal.owner}`.toLowerCase().includes(needle)
    })
  }, [deals, query, showLost])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Deals</h1>
          <p>Move opportunities from first conversation to closed revenue.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>
          New Deal
        </Button>
      </header>
      <div className="toolbar">
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search deals</span>
          <input
            value={query}
            placeholder="Search deals, companies, or owners"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="lost-toggle">
          <Toggle checked={showLost} onChange={setShowLost} label="Show closed lost deals" />
          <span>Show closed lost</span>
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Handshake size={18} />}
          title="No deals found"
          description="Create your first deal to start tracking your sales pipeline."
          action={<Button onClick={() => setOpen(true)}>Create Deal</Button>}
        />
      ) : (
        <PipelineBoard stages={stages} deals={filtered} />
      )}
      <DealModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
