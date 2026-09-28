import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useApp } from '../../context/AppContext'
import type { DealStage } from '../../types'

const order: DealStage[] = ['New Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
const colors = ['#2451F0', '#6D5EF5', '#0E7490', '#B45309', '#0F9F6E', '#BE3A4A']

export function StageChart() {
  const { deals, theme } = useApp()
  const dark = theme === 'dark'
  const tick = dark ? '#93A0B8' : '#667085'
  const data = order.map((stage) => ({
    stage: stage === 'Won' ? 'Won' : stage === 'Lost' ? 'Lost' : stage,
    count: deals.filter((deal) => deal.stage === stage).length,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
        <XAxis type="number" allowDecimals={false} tick={{ fill: tick, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="stage"
          width={92}
          tick={{ fill: tick, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [Number(value ?? 0), 'Deals']}
          contentStyle={{
            background: dark ? '#121A2E' : '#ffffff',
            border: `1px solid ${dark ? '#26324C' : '#E6EAF2'}`,
            borderRadius: 10,
            fontSize: 12,
            color: dark ? '#F5F7FB' : '#101828',
          }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={14}>
          {data.map((entry, index) => (
            <Cell key={entry.stage} fill={colors[index] ?? colors[0]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
