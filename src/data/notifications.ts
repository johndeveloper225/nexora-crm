import type { NotificationItem } from '../types'

export const notificationSeed: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New lead assigned to you.',
    body: 'Hannah Lee at Orbit Cloud was assigned to Alex Morgan.',
    time: '8 min ago',
    read: false,
    type: 'lead',
  },
  {
    id: 'n2',
    title: 'Acme Corporation moved to Proposal.',
    body: 'Acme Enterprise Plan is now in Proposal at 75% probability.',
    time: '34 min ago',
    read: false,
    type: 'deal',
  },
  {
    id: 'n3',
    title: 'Task deadline approaching.',
    body: 'Follow up with Acme Corporation is due today.',
    time: '1 hr ago',
    read: false,
    type: 'task',
  },
  {
    id: 'n4',
    title: 'New contact added.',
    body: 'Sarah Carter added Hannah Lee to the workspace.',
    time: '3 hr ago',
    read: true,
    type: 'contact',
  },
  {
    id: 'n5',
    title: 'Weekly pipeline report is ready.',
    body: 'Recognized revenue for the trailing 12 months is $284,500.',
    time: 'Yesterday',
    read: true,
    type: 'report',
  },
]
