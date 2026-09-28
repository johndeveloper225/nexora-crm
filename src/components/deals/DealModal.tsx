import { useEffect, useState, type FormEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { DEAL_STAGES, OWNERS, type DealInput, type DealStage } from '../../types'
import { isoDate } from '../../lib/format'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Modal } from '../ui/Modal'

const blank = (): DealInput => ({
  name: '',
  companyId: '',
  value: 10000,
  probability: 40,
  stage: 'New Lead',
  expectedClose: isoDate(14),
  owner: 'Alex Morgan',
})

export function DealModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { companies, addDeal, pushToast } = useApp()
  const [values, setValues] = useState<DealInput>(blank)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    setValues({ ...blank(), companyId: companies[0]?.id ?? '' })
    setErrors({})
  }, [open, companies])

  function submit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!values.name.trim()) next.name = 'Deal name is required.'
    if (!values.companyId) next.companyId = 'Choose a company.'
    if (!values.value || values.value <= 0) next.value = 'Enter a value greater than zero.'
    if (values.probability < 0 || values.probability > 100) next.probability = 'Use a probability from 0 to 100.'
    if (!values.expectedClose) next.expectedClose = 'Choose a close date.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    addDeal(values)
    pushToast('Deal created')
    onClose()
  }

  return (
    <Modal
      open={open}
      title="New Deal"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="deal-form">
            Create Deal
          </Button>
        </>
      }
    >
      <form id="deal-form" className="field-grid" onSubmit={submit}>
        <div className="field span-2">
          <label htmlFor="deal-name">Deal name</label>
          <input
            id="deal-name"
            className={`input${errors.name ? ' invalid' : ''}`}
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          />
          {errors.name ? <p className="field-error">{errors.name}</p> : null}
        </div>
        <Field label="Company" htmlFor="deal-company" error={errors.companyId}>
          <select
            id="deal-company"
            className={`input${errors.companyId ? ' invalid' : ''}`}
            value={values.companyId}
            onChange={(event) => setValues((current) => ({ ...current, companyId: event.target.value }))}
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Owner" htmlFor="deal-owner">
          <select
            id="deal-owner"
            className="input"
            value={values.owner}
            onChange={(event) => setValues((current) => ({ ...current, owner: event.target.value }))}
          >
            {OWNERS.map((owner) => (
              <option key={owner}>{owner}</option>
            ))}
          </select>
        </Field>
        <Field label="Value" htmlFor="deal-value" error={errors.value}>
          <input
            id="deal-value"
            type="number"
            min={1}
            className={`input${errors.value ? ' invalid' : ''}`}
            value={values.value}
            onChange={(event) => setValues((current) => ({ ...current, value: Number(event.target.value) }))}
          />
        </Field>
        <Field label="Probability (%)" htmlFor="deal-probability" error={errors.probability}>
          <input
            id="deal-probability"
            type="number"
            min={0}
            max={100}
            className={`input${errors.probability ? ' invalid' : ''}`}
            value={values.probability}
            onChange={(event) =>
              setValues((current) => ({ ...current, probability: Number(event.target.value) }))
            }
          />
        </Field>
        <Field label="Stage" htmlFor="deal-stage">
          <select
            id="deal-stage"
            className="input"
            value={values.stage}
            onChange={(event) => setValues((current) => ({ ...current, stage: event.target.value as DealStage }))}
          >
            {DEAL_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage === 'Won' ? 'Won' : stage === 'Lost' ? 'Closed Lost' : stage}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Expected close date" htmlFor="deal-close" error={errors.expectedClose}>
          <input
            id="deal-close"
            type="date"
            className={`input${errors.expectedClose ? ' invalid' : ''}`}
            value={values.expectedClose}
            onChange={(event) => setValues((current) => ({ ...current, expectedClose: event.target.value }))}
          />
        </Field>
      </form>
    </Modal>
  )
}
