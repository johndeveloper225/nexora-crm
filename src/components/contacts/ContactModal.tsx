import { useEffect, useState, type FormEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { CONTACT_STATUSES, OWNERS, type Contact, type ContactInput, type ContactStatus } from '../../types'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Modal } from '../ui/Modal'

const empty: ContactInput = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  status: 'Lead',
  owner: 'Alex Morgan',
  notes: '',
  title: '',
}

function toInput(contact: Contact): ContactInput {
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    status: contact.status,
    owner: contact.owner,
    notes: contact.notes,
    title: contact.title,
  }
}

function validate(values: ContactInput) {
  const errors: Partial<Record<keyof ContactInput, string>> = {}
  if (!values.firstName.trim()) errors.firstName = 'First name is required.'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email.'
  if (values.phone.trim().length < 7) errors.phone = 'Enter a phone number.'
  if (!values.company.trim()) errors.company = 'Company is required.'
  return errors
}

export function ContactModal({
  open,
  onClose,
  contact,
}: {
  open: boolean
  onClose: () => void
  contact?: Contact | null
}) {
  const { companies, addContact, updateContact, pushToast } = useApp()
  const [values, setValues] = useState<ContactInput>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({})
  const editing = Boolean(contact)

  useEffect(() => {
    if (!open) return
    setValues(contact ? toInput(contact) : empty)
    setErrors({})
  }, [open, contact])

  function update<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    if (contact) {
      updateContact(contact.id, values)
      pushToast('Contact updated')
    } else {
      addContact(values)
      pushToast('Contact created')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      title={editing ? 'Edit Contact' : 'Add Contact'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="contact-form">
            {editing ? 'Save Changes' : 'Create Contact'}
          </Button>
        </>
      }
    >
      <form id="contact-form" className="field-grid" onSubmit={submit}>
        <Field label="First Name" htmlFor="firstName" error={errors.firstName}>
          <input
            id="firstName"
            className={`input${errors.firstName ? ' invalid' : ''}`}
            value={values.firstName}
            onChange={(event) => update('firstName', event.target.value)}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last Name" htmlFor="lastName" error={errors.lastName}>
          <input
            id="lastName"
            className={`input${errors.lastName ? ' invalid' : ''}`}
            value={values.lastName}
            onChange={(event) => update('lastName', event.target.value)}
            autoComplete="family-name"
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            className={`input${errors.email ? ' invalid' : ''}`}
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            className={`input${errors.phone ? ' invalid' : ''}`}
            value={values.phone}
            onChange={(event) => update('phone', event.target.value)}
            autoComplete="tel"
          />
        </Field>
        <Field label="Company" htmlFor="company" error={errors.company}>
          <input
            id="company"
            className={`input${errors.company ? ' invalid' : ''}`}
            list="company-list"
            value={values.company}
            onChange={(event) => update('company', event.target.value)}
          />
          <datalist id="company-list">
            {companies.map((company) => (
              <option key={company.id} value={company.name} />
            ))}
          </datalist>
        </Field>
        <Field label="Title" htmlFor="title">
          <input
            id="title"
            className="input"
            value={values.title}
            onChange={(event) => update('title', event.target.value)}
            placeholder="VP of Operations"
          />
        </Field>
        <Field label="Status" htmlFor="status">
          <select
            id="status"
            className="input"
            value={values.status}
            onChange={(event) => update('status', event.target.value as ContactStatus)}
          >
            {CONTACT_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </Field>
        <Field label="Owner" htmlFor="owner">
          <select
            id="owner"
            className="input"
            value={values.owner}
            onChange={(event) => update('owner', event.target.value)}
          >
            {OWNERS.map((owner) => (
              <option key={owner}>{owner}</option>
            ))}
          </select>
        </Field>
        <div className="field span-2">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            className="input textarea"
            rows={4}
            value={values.notes}
            onChange={(event) => update('notes', event.target.value)}
          />
        </div>
      </form>
    </Modal>
  )
}
