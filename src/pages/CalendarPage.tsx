import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { eventSeed } from '../data/events'
import { useApp } from '../context/AppContext'
import { formatDate, isoDate, parseIso, toIso } from '../lib/format'
import { usePageTitle } from '../lib/hooks'

type Mode = 'month' | 'week' | 'day'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarPage() {
  const { tasks } = useApp()
  const [cursor, setCursor] = useState(() => new Date())
  const [selected, setSelected] = useState(() => isoDate(0))
  const [mode, setMode] = useState<Mode>('month')
  usePageTitle('Calendar · NEXORA CRM')
  const today = isoDate(0)

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const cells = useMemo(() => buildMonth(cursor), [cursor])
  const selectedEvents = eventSeed.filter((event) => event.date === selected).sort((a, b) => a.minutes - b.minutes)
  const selectedTasks = tasks.filter((task) => task.due === selected && !task.completed)
  const upcoming = eventSeed
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.minutes - b.minutes)
    .slice(0, 5)

  function shift(direction: number) {
    const next = new Date(cursor)
    if (mode === 'month') next.setMonth(next.getMonth() + direction)
    else if (mode === 'week') next.setDate(next.getDate() + direction * 7)
    else next.setDate(next.getDate() + direction)
    setCursor(next)
    if (mode !== 'month') setSelected(toIso(next))
  }

  function jumpToday() {
    const now = new Date()
    setCursor(now)
    setSelected(toIso(now))
  }

  const week = useMemo(() => buildWeek(mode === 'week' ? toIso(cursor) : selected), [cursor, mode, selected])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Calendar</h1>
          <p>Meetings, follow-ups, and the tasks attached to this week.</p>
        </div>
        <div className="row wrap">
          <div className="seg" role="tablist" aria-label="Calendar view">
            {(['month', 'week', 'day'] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={mode === item}
                className={mode === item ? 'seg-btn active' : 'seg-btn'}
                onClick={() => {
                  setMode(item)
                  if (item !== 'month') setCursor(parseIso(selected))
                }}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="cal-layout">
        <section className="card cal-main">
          <div className="cal-toolbar">
            <div className="row">
              <button type="button" className="icon-btn" aria-label="Previous" onClick={() => shift(-1)}>
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="icon-btn" aria-label="Next" onClick={() => shift(1)}>
                <ChevronRight size={18} />
              </button>
              <h2>{mode === 'day' ? formatDate(selected) : monthLabel}</h2>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={jumpToday}>
              Today
            </button>
          </div>

          {mode === 'month' ? (
            <div className="month-grid">
              {weekdays.map((day) => (
                <div key={day} className="cal-dow">
                  {day}
                </div>
              ))}
              {cells.map((cell) => {
                const events = eventSeed.filter((event) => event.date === cell.iso)
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    className={`cal-cell${cell.inMonth ? '' : ' is-muted'}${cell.iso === selected ? ' is-selected' : ''}${cell.iso === today ? ' is-today' : ''}`}
                    onClick={() => setSelected(cell.iso)}
                  >
                    <span>{parseIso(cell.iso).getDate()}</span>
                    <span className="cal-dots">
                      {events.slice(0, 3).map((event) => (
                        <i key={event.id} className={event.type} />
                      ))}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}

          {mode === 'week' ? (
            <div className="week-grid">
              {week.map((iso) => {
                const events = eventSeed.filter((event) => event.date === iso)
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`week-col${iso === selected ? ' is-selected' : ''}${iso === today ? ' is-today' : ''}`}
                    onClick={() => setSelected(iso)}
                  >
                    <strong>
                      {weekdays[parseIso(iso).getDay()]} {parseIso(iso).getDate()}
                    </strong>
                    {events.length === 0 ? <span className="muted">Open</span> : null}
                    {events.map((event) => (
                      <span key={event.id} className={`event-chip ${event.type}`}>
                        {event.time} · {event.title}
                      </span>
                    ))}
                  </button>
                )
              })}
            </div>
          ) : null}

          {mode === 'day' ? (
            <div className="day-grid">
              {Array.from({ length: 11 }, (_, index) => index + 8).map((hour) => {
                const events = selectedEvents.filter((event) => Math.floor(event.minutes / 60) === hour)
                return (
                  <div key={hour} className="day-slot">
                    <time>{formatHour(hour)}</time>
                    <div>
                      {events.map((event) => (
                        <article key={event.id} className={`event-chip ${event.type}`}>
                          <strong>
                            {event.time} — {event.title}
                          </strong>
                          <small>
                            {event.duration} · {event.related}
                          </small>
                        </article>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </section>

        <aside className="stack">
          <section className="card">
            <h2>{formatDate(selected)}</h2>
            {selectedEvents.length === 0 && selectedTasks.length === 0 ? (
              <p className="muted">No meetings on this day. Upcoming work is listed below.</p>
            ) : null}
            <ul className="agenda">
              {selectedEvents.map((event) => (
                <li key={event.id}>
                  <time>{event.time}</time>
                  <div>
                    <strong>{event.title}</strong>
                    <small>
                      {event.type} · {event.duration} · {event.related}
                    </small>
                  </div>
                </li>
              ))}
              {selectedTasks.map((task) => (
                <li key={task.id}>
                  <time>Task</time>
                  <div>
                    <strong>{task.title}</strong>
                    <small>
                      {task.priority} · {task.owner}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2>Upcoming</h2>
            <ul className="agenda">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <time>{event.time}</time>
                  <div>
                    <strong>{event.title}</strong>
                    <small>{formatDate(event.date)}</small>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

function buildMonth(cursor: Date) {
  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const lead = start.getDay()
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const cells: { iso: string; inMonth: boolean }[] = []
  for (let index = 0; index < lead; index += 1) {
    const date = new Date(start)
    date.setDate(date.getDate() - (lead - index))
    cells.push({ iso: toIso(date), inMonth: false })
  }
  for (let day = 1; day <= days; day += 1) {
    cells.push({ iso: toIso(new Date(cursor.getFullYear(), cursor.getMonth(), day)), inMonth: true })
  }
  while (cells.length % 7 !== 0) {
    const last = parseIso(cells[cells.length - 1].iso)
    last.setDate(last.getDate() + 1)
    cells.push({ iso: toIso(last), inMonth: false })
  }
  return cells
}

function buildWeek(iso: string) {
  const start = parseIso(iso)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return toIso(date)
  })
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const value = hour % 12 || 12
  return `${value}:00 ${suffix}`
}
