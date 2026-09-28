import { ListChecks, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TaskModal } from '../components/tasks/TaskModal'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { TaskItem } from '../components/ui/TaskItem'
import { useApp } from '../context/AppContext'
import { isoDate } from '../lib/format'
import { usePageTitle } from '../lib/hooks'

const filters = ['All', 'Today', 'Upcoming', 'Completed'] as const

export function Tasks() {
  const { tasks, toggleTask, deleteTask } = useApp()
  const [params] = useSearchParams()
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [open, setOpen] = useState(false)
  usePageTitle('Tasks · NEXORA CRM')
  const today = isoDate(0)

  useEffect(() => {
    const next = params.get('q')
    if (next) setQuery(next)
  }, [params])

  const counts = useMemo(
    () => ({
      All: tasks.length,
      Today: tasks.filter((task) => task.due === today && !task.completed).length,
      Upcoming: tasks.filter((task) => task.due > today && !task.completed).length,
      Completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks, today],
  )

  const visible = tasks
    .filter((task) => {
      const needle = query.trim().toLowerCase()
      const matchesQuery = `${task.title} ${task.related} ${task.owner}`.toLowerCase().includes(needle)
      if (!matchesQuery) return false
      if (filter === 'Today') return task.due === today && !task.completed
      if (filter === 'Upcoming') return task.due > today && !task.completed
      if (filter === 'Completed') return task.completed
      return true
    })
    .sort((a, b) => Number(a.completed) - Number(b.completed) || a.due.localeCompare(b.due))

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>Stay ahead of follow-ups, calls, and the work that closes deals.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>
          Add Task
        </Button>
      </header>
      <div className="toolbar">
        <div className="chip-row" role="tablist" aria-label="Task filters">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={filter === item}
              className={filter === item ? 'chip active' : 'chip'}
              onClick={() => setFilter(item)}
            >
              {item}
              <span>{counts[item]}</span>
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search tasks</span>
          <input value={query} placeholder="Search tasks" onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>
      {visible.length === 0 ? (
        <EmptyState
          icon={<ListChecks size={18} />}
          title="No tasks found"
          description="Add a follow-up so the next conversation does not slip."
          action={<Button onClick={() => setOpen(true)}>Add Task</Button>}
        />
      ) : (
        <div className="card task-list">
          {visible.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))}
        </div>
      )}
      <TaskModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
