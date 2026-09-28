import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RevenuePoint } from '../../data/chartData'
import { useApp } from '../../context/AppContext'
import { compactMoney, money } from '../../lib/format'

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const { theme } = useApp()
  const dark = theme === 'dark'
  const tick = dark ? '#93A0B8' : '#667085'
  const grid = dark ? '#26324C' : '#E6EAF2'

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2451F0" stopOpacity={dark ? 0.5 : 0.28} />
            <stop offset="100%" stopColor="#2451F0" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: tick, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(value: number) => compactMoney(value)}
          tick={{ fill: tick, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={46}
        />
        <Tooltip
          formatter={(value) => [money(Number(value ?? 0)), 'Revenue']}
          contentStyle={{
            background: dark ? '#121A2E' : '#ffffff',
            border: `1px solid ${grid}`,
            borderRadius: 10,
            fontSize: 12,
            color: dark ? '#F5F7FB' : '#101828',
          }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#2451F0" strokeWidth={2.4} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
