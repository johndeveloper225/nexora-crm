import { money } from '../../lib/format'

const deals = [
  ['Acme Enterprise Plan', 'Proposal', 45000],
  ['Nova Systems Platform', 'Negotiation', 62000],
  ['Bright Labs Expansion', 'Qualified', 28500],
] as const

const tasks = ['Follow up with Acme Corporation', 'Prepare proposal for Bright Labs', 'Call Olivia Carter']

export function DashboardMock() {
  return (
    <div className="mock">
      <div className="mock-chrome">
        <span className="logo-mark" aria-hidden="true">
          N
        </span>
        <span className="mock-nav">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="mock-user">Alex Morgan</span>
      </div>
      <div className="mock-kpis">
        <MockStat label="Revenue" value="$284,500" delta="+12.8%" />
        <MockStat label="Active deals" value="48" delta="+8.4%" />
        <MockStat label="New contacts" value="326" delta="+18.2%" />
        <MockStat label="Conversion" value="24.8%" delta="+4.6%" />
      </div>
      <div className="mock-body">
        <div className="mock-chart">
          <div className="spread">
            <strong>Revenue</strong>
            <span>12 months</span>
          </div>
          <svg viewBox="0 0 320 110" role="img" aria-label="Sample revenue trend">
            <defs>
              <linearGradient id="mockFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2451F0" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#2451F0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 78 C28 76 36 70 58 66 C86 60 92 48 120 50 C150 52 160 30 190 28 C220 26 236 18 262 20 C286 22 300 12 320 10 L320 110 L0 110 Z"
              fill="url(#mockFill)"
            />
            <path
              d="M0 78 C28 76 36 70 58 66 C86 60 92 48 120 50 C150 52 160 30 190 28 C220 26 236 18 262 20 C286 22 300 12 320 10"
              fill="none"
              stroke="#2451F0"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="mock-side">
          <div>
            <strong>Recent deals</strong>
            <ul>
              {deals.map(([name, stage, value]) => (
                <li key={name}>
                  <span>
                    {name}
                    <small>{stage}</small>
                  </span>
                  <b>{money(value)}</b>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Tasks</strong>
            <ul className="mock-tasks">
              {tasks.map((task) => (
                <li key={task}>
                  <i />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockStat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{delta}</em>
    </div>
  )
}
