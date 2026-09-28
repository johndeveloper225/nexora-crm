export type RevenuePoint = { label: string; revenue: number }
export type RangeKey = '7d' | '30d' | '90d' | '12m'

export const revenueSeries: Record<RangeKey, RevenuePoint[]> = {
  '7d': [
    { label: 'Mon', revenue: 4200 },
    { label: 'Tue', revenue: 6100 },
    { label: 'Wed', revenue: 5400 },
    { label: 'Thu', revenue: 7800 },
    { label: 'Fri', revenue: 6900 },
    { label: 'Sat', revenue: 3100 },
    { label: 'Sun', revenue: 2800 },
  ],
  '30d': [
    { label: 'Aug 31', revenue: 6200 },
    { label: 'Sep 7', revenue: 7100 },
    { label: 'Sep 14', revenue: 8400 },
    { label: 'Sep 21', revenue: 9800 },
  ],
  '90d': [
    { label: 'Jul W1', revenue: 5800 },
    { label: 'Jul W2', revenue: 6200 },
    { label: 'Jul W3', revenue: 6400 },
    { label: 'Jul W4', revenue: 6500 },
    { label: 'Aug W1', revenue: 7000 },
    { label: 'Aug W2', revenue: 7400 },
    { label: 'Aug W3', revenue: 7600 },
    { label: 'Aug W4', revenue: 8200 },
    { label: 'Sep W1', revenue: 7600 },
    { label: 'Sep W2', revenue: 7800 },
    { label: 'Sep W3', revenue: 7400 },
    { label: 'Sep W4', revenue: 7900 },
  ],
  '12m': [
    { label: 'Oct', revenue: 18800 },
    { label: 'Nov', revenue: 19400 },
    { label: 'Dec', revenue: 17900 },
    { label: 'Jan', revenue: 20200 },
    { label: 'Feb', revenue: 22100 },
    { label: 'Mar', revenue: 23400 },
    { label: 'Apr', revenue: 25600 },
    { label: 'May', revenue: 24800 },
    { label: 'Jun', revenue: 26500 },
    { label: 'Jul', revenue: 24900 },
    { label: 'Aug', revenue: 30200 },
    { label: 'Sep', revenue: 30700 },
  ],
}

export const rangeLabels: { id: RangeKey; label: string }[] = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
]

export const dashboardKpis = [
  { id: 'revenue', label: 'Total Revenue', value: '$284,500', delta: 12.8, hint: 'Trailing 12 months' },
  { id: 'deals', label: 'Active Deals', value: '48', delta: 8.4, hint: 'Open opportunities' },
  { id: 'contacts', label: 'New Contacts', value: '326', delta: 18.2, hint: 'Added this quarter' },
  { id: 'conversion', label: 'Conversion Rate', value: '24.8%', delta: 4.6, hint: 'Lead to won' },
]

export const reportKpis = [
  { id: 'revenue', label: 'Revenue', value: '$284,500', hint: 'Recognized, trailing 12 months' },
  { id: 'won', label: 'Deals Won', value: '36', hint: 'Closed-won this period' },
  { id: 'average', label: 'Average Deal Size', value: '$7,903', hint: 'Across closed-won deals' },
  { id: 'win', label: 'Win Rate', value: '28.4%', hint: 'Won divided by created opportunities' },
]

export const performanceSeries = [
  { month: 'Apr', alex: 16000, sarah: 14000, james: 11000 },
  { month: 'May', alex: 18500, sarah: 15200, james: 12400 },
  { month: 'Jun', alex: 21000, sarah: 16800, james: 10800 },
  { month: 'Jul', alex: 19000, sarah: 17400, james: 13200 },
  { month: 'Aug', alex: 24000, sarah: 16800, james: 14000 },
  { month: 'Sep', alex: 26000, sarah: 18000, james: 15000 },
]

export const conversionFunnel = [
  { label: 'New contacts', value: 326 },
  { label: 'Qualified', value: 214 },
  { label: 'Meetings', value: 168 },
  { label: 'Proposals', value: 112 },
  { label: 'Won', value: 81 },
]

export const leaderboard = [
  { name: 'Alex Morgan', amount: 124500, role: 'Head of Sales' },
  { name: 'Sarah Carter', amount: 98200, role: 'Account Executive' },
  { name: 'James Wilson', amount: 76400, role: 'Account Executive' },
]
