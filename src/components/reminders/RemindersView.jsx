import React, { useState } from 'react'
import { StatusBadge } from '../common/StatusBadge'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../lib/utils'
import {
  Bell,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle,
  PlusCircle,
  Phone,
  Mail,
  Home,
  Check,
} from 'lucide-react'

export const RemindersView = ({ onOpenRecordPayment }) => {
  const { stats, currency } = useData()
  const [filterType, setFilterType] = useState('ALL') // 'ALL' | 'overdue' | 'due_soon' | 'pending' | 'lease_expiring'

  const allReminders = stats.reminders

  const filteredReminders = allReminders.filter((r) => {
    if (filterType === 'ALL') return true
    return r.type === filterType
  })

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            filterType === 'ALL'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>All Reminders</span>
          <span className="text-[10px] opacity-75">({allReminders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('overdue')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            filterType === 'overdue'
              ? 'bg-rose-600 text-white'
              : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Overdue Rent</span>
          <span className="text-[10px]">({stats.overdueCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('due_soon')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            filterType === 'due_soon'
              ? 'bg-amber-600 text-white'
              : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Due Soon (≤ 5 Days)</span>
          <span className="text-[10px]">({stats.dueSoonCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            filterType === 'pending'
              ? 'bg-blue-600 text-white'
              : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50'
          }`}
        >
          <span>Pending Monthly</span>
          <span className="text-[10px]">({stats.pendingCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('lease_expiring')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            filterType === 'lease_expiring'
              ? 'bg-purple-600 text-white'
              : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50'
          }`}
        >
          <span>Leases Expiring Soon</span>
          <span className="text-[10px]">({stats.expiringLeaseCount})</span>
        </button>
      </div>

      {/* Reminder Cards List */}
      {filteredReminders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center shadow-sm">
          <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            No active reminders in this category
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            All tenant rent due dates are up to date and no leases are currently pending action.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReminders.map((rem) => {
            const isOverdue = rem.type === 'overdue'
            const isDueSoon = rem.type === 'due_soon'
            const isLease = rem.type === 'lease_expiring'

            return (
              <div
                key={rem.id}
                className={`p-4 sm:p-5 rounded-xl border transition shadow-sm bg-white dark:bg-zinc-900 flex flex-col justify-between ${
                  isOverdue
                    ? 'border-rose-200 dark:border-rose-900/60 hover:border-rose-300'
                    : isDueSoon
                    ? 'border-amber-200 dark:border-amber-900/60 hover:border-amber-300'
                    : isLease
                    ? 'border-purple-200 dark:border-purple-900/60 hover:border-purple-300'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div>
                  {/* Top reminder badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isOverdue
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          : isDueSoon
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : isLease
                          ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {isOverdue && <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />}
                      {isDueSoon && <Clock className="w-3 h-3 text-amber-500" />}
                      {isLease && <Calendar className="w-3 h-3 text-purple-500" />}
                      {isOverdue
                        ? 'Payment Overdue'
                        : isDueSoon
                        ? 'Rent Due Soon'
                        : isLease
                        ? 'Lease Ending Soon'
                        : 'Rent Pending'}
                    </span>

                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(rem.amount, currency)}
                    </span>
                  </div>

                  {/* Title & Unit */}
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {rem.tenantName}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {rem.unitInfo}
                  </p>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2">
                    {rem.description}
                  </p>

                  {/* Contact info pills */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400">
                    {rem.phone && (
                      <a
                        href={`tel:${rem.phone}`}
                        className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{rem.phone}</span>
                      </a>
                    )}
                    {rem.email && (
                      <a
                        href={`mailto:${rem.email}`}
                        className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{rem.email}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenRecordPayment({
                        tenant_id: rem.tenantId,
                        amount: rem.amount,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition shadow-sm text-white ${
                      isOverdue
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
