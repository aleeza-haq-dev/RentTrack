import React from 'react'
import { StatsOverview } from './StatsOverview'
import { RecentPaymentsTable } from './RecentPaymentsTable'
import { UpcomingDueList } from './UpcomingDueList'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  PlusCircle,
  Building2,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export const DashboardView = ({
  onNavigate,
  onOpenAddProperty,
  onOpenAddTenant,
  onOpenRecordPayment,
}) => {
  const { user, profile } = useAuth()
  const { stats } = useData()

  const landlordName = profile?.full_name || user?.user_metadata?.full_name || 'Landlord'

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back, {landlordName}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Here is your current rental portfolio status, collection progress, and pending items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddProperty}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition border border-zinc-200 dark:border-zinc-700"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddTenant}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition border border-zinc-200 dark:border-zinc-700"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Add Tenant</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenRecordPayment()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Overdue Alert Banner if rent is overdue */}
      {stats.overdueCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3 text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {stats.overdueCount} {stats.overdueCount === 1 ? 'tenant has' : 'tenants have'} overdue rent this month.
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                Review reminders to follow up and record overdue collections.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('reminders')}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline"
          >
            <span>Review Reminders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <StatsOverview onNavigate={onNavigate} />

      {/* Tables & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPaymentsTable
          onNavigate={onNavigate}
          onRecordPayment={onOpenRecordPayment}
        />
        <UpcomingDueList
          onNavigate={onNavigate}
          onRecordPayment={onOpenRecordPayment}
        />
      </div>
    </div>
  )
}
