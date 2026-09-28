import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RevenueChart } from '../components/charts/RevenueChart'
import { ContactModal } from '../components/contacts/ContactModal'
import { PipelineBoard } from '../components/deals/PipelineBoard'
import { Button } from '../components/ui/Button'
import { ChartCard } from '../components/ui/ChartCard'
import { KpiCard } from '../components/ui/KpiCard'
import { TaskItem } from '../components/ui/TaskItem'
import { useApp } from '../context/AppContext'
import { dashboardKpis, rangeLabels, revenueSeries, type RangeKey } from '../data/chartData'
import { greetingFor, isoDate, money } from '../lib/format'
import { usePageTitle } from '../lib/hooks'
import type { Activity, DealStage } from '../types'

const stages: { id: DealStage; label: string }[] = [
  { id: 'New Lead', label: 'New Lead' },
  { id: 'Qualified', label: 'Qualified' },
  { id: 'Proposal', label: 'Proposal' },
  { id: 'Negotiation', label: 'Negotiation' },
  { id: 'Won', label: 'Closed Won' },
  { id: 'Lost', label: 'Closed Lost' },
]

export function Dashboard() {
  const { profile, activities, tasks, toggleTask, deleteTask, deals } = useApp()
  const [range, setRange] = useState<RangeKey>('12m')
  const [open, setOpen] = useState(false)
  usePageTitle('Dashboard · NEXORA CRM')

  const series = revenueSeries[range]
  const total = series.reduce((sum, point) => sum + point.revenue, 0)
  const today = isoDate(0)
  const todaysTasks = tasks.filter((task) => task.due === today && !task.completed).slice(0, 4)
  const openPipeline = useMemo(
    () => deals.filter((deal) => deal.stage !== 'Won' && deal.stage !== 'Lost').reduce((sum, deal) => sum + deal.value, 0),
    [deals],
  )

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>
            {greetingFor()}, {profile.firstName}
          </h1>
          <p>Here&apos;s what&apos;s happening with your sales pipeline today.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>
          Add Contact
        </Button>
      </header>

      <section className="grid-4" aria-label="Key metrics">
        {dashboardKpis.map((kpi) => (
          <KpiCard key={kpi.id} label={kpi.label} value={kpi.value} delta={kpi.delta} hint={kpi.hint} />
        ))}
      </section>

      <section className="split">
        <ChartCard
          title="Revenue Overview"
          subtitle={`Selected range · ${money(total)}`}
          summary={`Revenue for the selected range is ${money(total)}.`}
          action={
            <div className="seg" role="tablist" aria-label="Revenue range">
              {rangeLabels.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={range === item.id}
                  className={range === item.id ? 'seg-btn active' : 'seg-btn'}
                  onClick={() => setRange(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          }
        >
          <RevenueChart data={series} />
        </ChartCard>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Recent Activity</h2>
              <p className="muted">Latest movement across the team</p>
            </div>
          </div>
          <ol className="timeline">
            {activities.slice(0, 6).map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </ol>
        </section>
      </section>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Sales Pipeline</h2>
            <p className="muted">{money(openPipeline)} in open opportunities</p>
          </div>
          <Link to="/deals" className="text-btn">
            Open deals
          </Link>
        </div>
        <PipelineBoard stages={stages} deals={deals} compact />
      </section>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Today&apos;s Tasks</h2>
            <p className="muted">Follow-ups that keep deals moving</p>
          </div>
          <Link to="/tasks" className="text-btn">
            View all tasks
          </Link>
        </div>
        {todaysTasks.length === 0 ? (
          <p className="muted pad">Nothing due today. The rest of the queue is on the tasks page.</p>
        ) : (
          <div className="task-list">
            {todaysTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </div>
        )}
      </section>

      <ContactModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

function ActivityRow({ activity }: { activity: Activity }) {
  return (
    <li className="timeline-item">
      <span className={`timeline-dot ${activity.type}`} aria-hidden="true" />
      <div>
        <p>
          <strong>{activity.actor}</strong> {activity.text}
        </p>
        <time className="muted">{activity.time}</time>
      </div>
    </li>
  )
}
