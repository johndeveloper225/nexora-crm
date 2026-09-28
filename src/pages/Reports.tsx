import { PerformanceChart } from '../components/charts/PerformanceChart'
import { RevenueChart } from '../components/charts/RevenueChart'
import { StageChart } from '../components/charts/StageChart'
import { Avatar } from '../components/ui/Avatar'
import { ChartCard } from '../components/ui/ChartCard'
import { KpiCard } from '../components/ui/KpiCard'
import { conversionFunnel, leaderboard, reportKpis, revenueSeries } from '../data/chartData'
import { money } from '../lib/format'
import { usePageTitle } from '../lib/hooks'

export function Reports() {
  usePageTitle('Reports · NEXORA CRM')
  const max = conversionFunnel[0]?.value ?? 1
  const top = leaderboard[0]?.amount ?? 1

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Trailing 12 months across the NEXORA sales team.</p>
        </div>
      </header>
      <section className="grid-4" aria-label="Report metrics">
        {reportKpis.map((kpi) => (
          <KpiCard key={kpi.id} label={kpi.label} value={kpi.value} hint={kpi.hint} />
        ))}
      </section>
      <section className="grid-2">
        <ChartCard
          title="Revenue by month"
          subtitle="Recognized revenue"
          summary="Monthly recognized revenue for the trailing year, totaling $284,500."
        >
          <RevenueChart data={revenueSeries['12m']} />
        </ChartCard>
        <ChartCard
          title="Deals by stage"
          subtitle="Current workspace pipeline"
          summary="Deal counts for each pipeline stage in this workspace."
        >
          <StageChart />
        </ChartCard>
        <ChartCard
          title="Sales performance"
          subtitle="Closed-won credit by representative"
          summary="Alex Morgan, Sarah Carter, and James Wilson closed-won credit from April through September."
        >
          <PerformanceChart />
        </ChartCard>
        <ChartCard
          title="Lead conversion"
          subtitle="81 wins from 326 new contacts · 24.8%"
          summary="Conversion funnel from new contacts to won deals."
        >
          <div className="funnel">
            {conversionFunnel.map((step) => (
              <div key={step.label} className="funnel-row">
                <span>{step.label}</span>
                <div className="funnel-track">
                  <div style={{ width: `${(step.value / max) * 100}%` }} />
                </div>
                <strong>{step.value}</strong>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>
      <section className="card">
        <div className="card-head">
          <div>
            <h2>Sales team leaderboard</h2>
            <p className="muted">Closed-won credit · trailing 12 months</p>
          </div>
        </div>
        <ol className="leaderboard">
          {leaderboard.map((person, index) => (
            <li key={person.name}>
              <span className="rank">{index + 1}</span>
              <Avatar name={person.name} size="md" alt="" />
              <div className="leader-copy">
                <strong>{person.name}</strong>
                <small>{person.role}</small>
                <div className="prob-bar" aria-hidden="true">
                  <span style={{ width: `${(person.amount / top) * 100}%` }} data-level="high" />
                </div>
              </div>
              <b>{money(person.amount)}</b>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
