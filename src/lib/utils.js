import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount, currency = '$') {
  const num = Number(amount) || 0
  return `${currency}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(dateString) {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  } catch (e) {
    return dateString
  }
}

export function getCurrentMonthYear() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function formatMonthYear(monthYearString) {
  if (!monthYearString) return ''
  try {
    const [year, month] = monthYearString.split('-')
    if (!year || !month) return monthYearString
    const date = new Date(Number(year), Number(month) - 1, 1)
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch (e) {
    return monthYearString
  }
}

export function calculatePaymentStatus(dueDateDay, monthYear, existingPayment = null) {
  if (existingPayment) {
    if (existingPayment.status === 'Paid') return 'Paid'
    if (existingPayment.status === 'Partial') return 'Partial'
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()

  let targetYear = currentYear
  let targetMonth = currentMonth

  if (monthYear) {
    const parts = monthYear.split('-')
    if (parts.length === 2) {
      targetYear = parseInt(parts[0], 10)
      targetMonth = parseInt(parts[1], 10)
    }
  }

  const dueDay = Math.min(Math.max(parseInt(dueDateDay, 10) || 1, 1), 28)
  const dueDate = new Date(targetYear, targetMonth - 1, dueDay)
  const today = new Date(currentYear, currentMonth - 1, currentDay)

  if (today > dueDate) {
    return 'Overdue'
  }
  return 'Pending'
}

export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
