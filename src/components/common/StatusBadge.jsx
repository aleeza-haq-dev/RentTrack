import React from 'react'
import { cn } from '../../lib/utils'

export const StatusBadge = ({ status, className }) => {
  const norm = (status || '').toLowerCase()

  if (norm === 'paid') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Paid
      </span>
    )
  }

  if (norm === 'overdue') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        Overdue
      </span>
    )
  }

  if (norm === 'pending') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Pending
      </span>
    )
  }

  if (norm === 'partial') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        Partial
      </span>
    )
  }

  if (norm === 'occupied') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Occupied
      </span>
    )
  }

  if (norm === 'vacant') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
        Vacant
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
        className
      )}
    >
      {status}
    </span>
  )
}
