import React from 'react'
import { useData } from '../../context/DataContext'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const ToastContainer = () => {
  const { toasts, removeToast } = useData()

  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg shadow-lg border text-sm font-medium transition-all transform animate-in slide-in-from-bottom-2 fade-in duration-200',
            toast.type === 'error' &&
              'bg-white dark:bg-zinc-900 border-rose-300 dark:border-rose-900/60 text-rose-900 dark:text-rose-200',
            toast.type === 'info' &&
              'bg-white dark:bg-zinc-900 border-blue-300 dark:border-blue-900/60 text-blue-900 dark:text-blue-200',
            (!toast.type || toast.type === 'success') &&
              'bg-white dark:bg-zinc-900 border-emerald-300 dark:border-emerald-900/60 text-zinc-900 dark:text-zinc-100'
          )}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            )}
            {(!toast.type || toast.type === 'success') && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm">{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 rounded transition"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
