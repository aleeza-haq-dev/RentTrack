import React from 'react'
import { MetricCard } from '../common/MetricCard'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../lib/utils'
import {
  Building2,
  Home,
  CheckCircle,
  HelpCircle,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  AlertOctagon,
} from 'lucide-react'

export const StatsOverview = ({ onNavigate }) => {
  const { stats, currency } = useData()

  return (
    <div className="space-y-6">
      {/* Property & Unit Portfolio Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Portfolio & Occupancy
          </h2>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {stats.occupancyRate}% Overall Occupancy
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <MetricCard
            title="Properties"
            value={stats.totalProperties}
            subtitle="Registered buildings"
            icon={Building2}
            iconBg="bg-zinc-100 dark:bg-zinc-800"
            iconColor="text-zinc-700 dark:text-zinc-300"
            onClick={() => onNavigate('properties')}
          />

          <MetricCard
            title="Total Units"
            value={stats.totalUnits}
            subtitle="Across all properties"
            icon={Home}
            iconBg="bg-zinc-100 dark:bg-zinc-800"
            iconColor="text-zinc-700 dark:text-zinc-300"
            onClick={() => onNavigate('properties')}
          />

          <MetricCard
            title="Occupied"
            value={stats.occupiedUnits}
            subtitle={`${stats.occupancyRate}% leased`}
            icon={CheckCircle}
            iconBg="bg-emerald-50 dark:bg-emerald-950/60"
            iconColor="text-emerald-600 dark:text-emerald-400"
            badge="Active"
            badgeType="success"
            onClick={() => onNavigate('properties')}
          />

          <MetricCard
            title="Vacant"
            value={stats.vacantUnits}
            subtitle={stats.vacantUnits > 0 ? 'Ready for lease' : 'Fully leased'}
            icon={HelpCircle}
            iconBg={stats.vacantUnits > 0 ? 'bg-amber-50 dark:bg-amber-950/60' : 'bg-zinc-100 dark:bg-zinc-800'}
            iconColor={stats.vacantUnits > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400'}
            badge={stats.vacantUnits > 0 ? 'Available' : 'Full'}
            badgeType={stats.vacantUnits > 0 ? 'warning' : 'neutral'}
            onClick={() => onNavigate('properties')}
          />

          <MetricCard
            title="Tenants"
            value={stats.totalTenants}
            subtitle="Active lease holders"
            icon={Users}
            iconBg="bg-blue-50 dark:bg-blue-950/60"
            iconColor="text-blue-600 dark:text-blue-400"
            onClick={() => onNavigate('tenants')}
          />
        </div>
      </div>

      {/* Financial Rent Overview Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Monthly Rent Performance (Current Month)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <MetricCard
            title="Expected Rent"
            value={formatCurrency(stats.expectedMonthlyRent, currency)}
            subtitle="Total monthly contracted rent"
            icon={DollarSign}
            iconBg="bg-zinc-100 dark:bg-zinc-800"
            iconColor="text-zinc-800 dark:text-zinc-200"
            onClick={() => onNavigate('payments')}
          />

          <MetricCard
            title="Collected Rent"
            value={formatCurrency(stats.collectedRent, currency)}
            subtitle="Received this month"
            icon={TrendingUp}
            iconBg="bg-emerald-50 dark:bg-emerald-950/60"
            iconColor="text-emerald-600 dark:text-emerald-400"
            badge="Received"
            badgeType="success"
            onClick={() => onNavigate('payments')}
          />

          <MetricCard
            title="Pending Rent"
            value={formatCurrency(stats.pendingRent, currency)}
            subtitle="Awaiting payment date"
            icon={Clock}
            iconBg="bg-amber-50 dark:bg-amber-950/60"
            iconColor="text-amber-600 dark:text-amber-400"
            badge="Pending"
            badgeType="warning"
            onClick={() => onNavigate('payments')}
          />

          <MetricCard
            title="Overdue Rent"
            value={formatCurrency(stats.overdueRent, currency)}
            subtitle={stats.overdueRent > 0 ? 'Requires landlord follow-up' : 'Zero overdue payments'}
            icon={AlertOctagon}
            iconBg={stats.overdueRent > 0 ? 'bg-rose-50 dark:bg-rose-950/60' : 'bg-zinc-100 dark:bg-zinc-800'}
            iconColor={stats.overdueRent > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-400'}
            badge={stats.overdueRent > 0 ? 'Attention' : 'Clear'}
            badgeType={stats.overdueRent > 0 ? 'danger' : 'success'}
            onClick={() => onNavigate('reminders')}
          />
        </div>
      </div>
    </div>
  )
}
