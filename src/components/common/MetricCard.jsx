import React from 'react'
import { cn } from '../../lib/utils'

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-zinc-600 dark:text-zinc-400',
  iconBg = 'bg-zinc-100 dark:bg-zinc-800',
  badge,
  badgeType = 'neutral',
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm transition hover:border-zinc-300 dark:hover:border-zinc-700',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </p>
        {Icon && (
          <div className={cn('p-2 rounded-lg flex items-center justify-center shrink-0', iconBg, iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {value}
        </h3>
        {badge && (
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold',
              badgeType === 'success' && 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
              badgeType === 'warning' && 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
              badgeType === 'danger' && 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
              badgeType === 'neutral' && 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}
