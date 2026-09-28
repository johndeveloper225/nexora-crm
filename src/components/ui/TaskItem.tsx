import { Trash2 } from 'lucide-react'
import { formatDateShort } from '../../lib/format'
import type { Task } from '../../types'
import { Badge } from './Badge'

export function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <article className={`task-item${task.completed ? ' done' : ''}`}>
      <label className="check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark “${task.title}” ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span />
      </label>
      <div className="task-copy">
        <strong>{task.title}</strong>
        <p className="muted">
          {task.type} · {task.related} · {task.owner} · Due {formatDateShort(task.due)}
        </p>
      </div>
      <Badge tone={task.priority}>{task.priority}</Badge>
      <button
        type="button"
        className="icon-btn"
        aria-label={`Delete ${task.title}`}
        onClick={() => onDelete(task.id)}
      >
        <Trash2 size={16} />
      </button>
    </article>
  )
}
