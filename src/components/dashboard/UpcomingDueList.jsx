import React from 'react'
import { StatusBadge } from '../common/StatusBadge'
import { formatCurrency } from '../../lib/utils'
import { useData } from '../../context/DataContext'
import { Calendar, Check, Plus, AlertCircle, ArrowUpRight } from 'lucide-react'

export const UpcomingDueList = ({ onRecordPayment, onNavigate }) => {
  const { stats, currency } = useData()
  const list = stats.upcomingDue

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Rent Due Dates
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Current month status by tenant
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('reminders')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <span>Reminders</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-y-auto max-h-[360px]">
        {list.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Calendar className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              No active tenants
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
              Add tenants to properties to track their monthly due dates and collection.
            </p>
          </div>
        ) : (
          list.map((item) => (
            <div
              key={item.tenantId}
              className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.tenantName}
                  </p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                  {item.propertyName} • {item.unitNumber} • Due Day {item.dueDay}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                    {formatCurrency(item.amount, currency)}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {item.isPaid
                      ? 'Collected'
                      : item.status === 'Overdue'
                      ? 'Overdue'
                      : 'Pending'}
                  </span>
                </div>

                {!item.isPaid ? (
                  <button
                    type="button"
                    onClick={() =>
                      onRecordPayment({
                        tenant_id: item.tenantId,
                        amount: item.amount,
                      })
                    }
                    className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 transition"
                    title={`Record payment for ${item.tenantName}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div
                    className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                    title="Rent Paid for current month"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
