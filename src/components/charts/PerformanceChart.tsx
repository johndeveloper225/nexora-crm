import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { performanceSeries } from '../../data/chartData'
import { useApp } from '../../context/AppContext'
import { compactMoney, money } from '../../lib/format'

export function PerformanceChart() {
  const { theme } = useApp()
  const dark = theme === 'dark'
  const tick = dark ? '#93A0B8' : '#667085'
  const grid = dark ? '#26324C' : '#E6EAF2'

  return (
    <div className="chart-fill">
      <div className="legend">
        <span><i style={{ background: '#2451F0' }} /> Alex Morgan</span>
        <span><i style={{ background: '#6D5EF5' }} /> Sarah Carter</span>
        <span><i style={{ background: '#12B76A' }} /> James Wilson</span>
      </div>
      <div className="chart-plot">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={performanceSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="month" tick={{ fill: tick, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(value: number) => compactMoney(value)}
          tick={{ fill: tick, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={46}
        />
        <Tooltip
          formatter={(value, name) => [money(Number(value ?? 0)), String(name)]}
          contentStyle={{
            background: dark ? '#121A2E' : '#ffffff',
            border: `1px solid ${grid}`,
            borderRadius: 10,
            fontSize: 12,
            color: dark ? '#F5F7FB' : '#101828',
          }}
        />
        <Bar dataKey="alex" name="Alex Morgan" fill="#2451F0" radius={[5, 5, 0, 0]} maxBarSize={18} />
        <Bar dataKey="sarah" name="Sarah Carter" fill="#6D5EF5" radius={[5, 5, 0, 0]} maxBarSize={18} />
        <Bar dataKey="james" name="James Wilson" fill="#12B76A" radius={[5, 5, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
      </div>
    </div>
  )
}
