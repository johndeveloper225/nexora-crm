import type { Activity, Note } from '../types'
import { isoDate } from '../lib/format'

export const activitySeed: Activity[] = [
  {
    id: 'act-1',
    actor: 'Sarah Carter',
    text: 'added a new contact.',
    time: '12 min ago',
    type: 'contact',
    contactId: 'hannah-lee',
  },
  {
    id: 'act-2',
    actor: 'Michael Brooks',
    text: 'moved Acme Corporation to Proposal.',
    time: '34 min ago',
    type: 'deal',
    contactId: 'olivia-carter',
  },
  {
    id: 'act-3',
    actor: 'James Wilson',
    text: 'completed a follow-up task.',
    time: '1 hr ago',
    type: 'task',
  },
  {
    id: 'act-4',
    actor: 'Alex Morgan',
    text: 'closed a $12,500 deal.',
    time: '2 hr ago',
    type: 'deal',
    contactId: 'emma-foster',
  },
  {
    id: 'act-5',
    actor: 'Alex Morgan',
    text: 'logged a call about the enterprise plan.',
    time: 'Yesterday',
    type: 'call',
    contactId: 'olivia-carter',
  },
  {
    id: 'act-6',
    actor: 'Sarah Carter',
    text: 'scheduled a proposal review with Bright Labs.',
    time: 'Yesterday',
    type: 'task',
    contactId: 'daniel-morgan',
  },
  {
    id: 'act-7',
    actor: 'James Wilson',
    text: 'shared the Nova Systems contract draft.',
    time: '2 days ago',
    type: 'deal',
    contactId: 'sophia-williams',
  },
  {
    id: 'act-8',
    actor: 'Michael Brooks',
    text: 'requested a security packet from Apex Health.',
    time: '3 days ago',
    type: 'note',
    contactId: 'liam-chen',
  },
]

export const noteSeed: Note[] = [
  {
    id: 'note-1',
    contactId: 'olivia-carter',
    author: 'Alex Morgan',
    body: 'Olivia wants pricing for 250 seats and a security review before legal.',
    createdAt: isoDate(-1),
  },
  {
    id: 'note-2',
    contactId: 'olivia-carter',
    author: 'Sarah Carter',
    body: 'Legal prefers a redline on the data processing addendum. Send the latest version tomorrow.',
    createdAt: isoDate(-3),
  },
  {
    id: 'note-3',
    contactId: 'daniel-morgan',
    author: 'Sarah Carter',
    body: 'Pilot should start with the product-led pod. Expansion quote can follow the readout.',
    createdAt: isoDate(-2),
  },
  {
    id: 'note-4',
    contactId: 'sophia-williams',
    author: 'James Wilson',
    body: 'Finance will sign if the platform and services quotes stay inside the approved envelope.',
    createdAt: isoDate(-4),
  },
  {
    id: 'note-5',
    contactId: 'hannah-lee',
    author: 'Alex Morgan',
    body: 'Inbound from the website. Interested in seats after a successful kickoff.',
    createdAt: isoDate(0),
  },
  {
    id: 'note-6',
    contactId: 'emma-foster',
    author: 'James Wilson',
    body: 'Annual deal is closed. Book the QBR and introduce the customer marketing team.',
    createdAt: isoDate(-9),
  },
]
