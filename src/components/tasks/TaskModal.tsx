import { useEffect, useState, type FormEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { isoDate } from '../../lib/format'
import { OWNERS, type TaskInput, type TaskPriority, type TaskType } from '../../types'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Modal } from '../ui/Modal'

const blank = (): TaskInput => ({
  title: '',
  due: isoDate(1),
  priority: 'Medium',
  related: '',
  owner: 'Alex Morgan',
  type: 'Follow-up',
})

const types: TaskType[] = ['Follow-up', 'Call', 'Proposal', 'Email', 'Meeting']
const priorities: TaskPriority[] = ['High', 'Medium', 'Low']

export function TaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addTask, pushToast } = useApp()
  const [values, setValues] = useState<TaskInput>(blank)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setValues(blank())
    setError('')
  }, [open])

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!values.title.trim()) {
      setError('Task title is required.')
      return
    }
    if (!values.due) {
      setError('Choose a due date.')
      return
    }
    addTask(values)
    pushToast('Task added')
    onClose()
  }

  return (
    <Modal
      open={open}
      title="Add Task"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            Create Task
          </Button>
        </>
      }
    >
      <form id="task-form" className="field-grid" onSubmit={submit}>
        <div className="field span-2">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            className={`input${error ? ' invalid' : ''}`}
            value={values.title}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
          />
          {error ? <p className="field-error">{error}</p> : null}
        </div>
        <Field label="Due date" htmlFor="task-due">
          <input
            id="task-due"
            type="date"
            className="input"
            value={values.due}
            onChange={(event) => setValues((current) => ({ ...current, due: event.target.value }))}
          />
        </Field>
        <Field label="Priority" htmlFor="task-priority">
          <select
            id="task-priority"
            className="input"
            value={values.priority}
            onChange={(event) =>
              setValues((current) => ({ ...current, priority: event.target.value as TaskPriority }))
            }
          >
            {priorities.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </Field>
        <Field label="Type" htmlFor="task-type">
          <select
            id="task-type"
            className="input"
            value={values.type}
            onChange={(event) => setValues((current) => ({ ...current, type: event.target.value as TaskType }))}
          >
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Related to" htmlFor="task-related">
          <input
            id="task-related"
            className="input"
            value={values.related}
            placeholder="Acme Corporation"
            onChange={(event) => setValues((current) => ({ ...current, related: event.target.value }))}
          />
        </Field>
        <div className="field span-2">
          <label htmlFor="task-owner">Owner</label>
          <select
            id="task-owner"
            className="input"
            value={values.owner}
            onChange={(event) => setValues((current) => ({ ...current, owner: event.target.value }))}
          >
            {OWNERS.map((owner) => (
              <option key={owner}>{owner}</option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  )
}
