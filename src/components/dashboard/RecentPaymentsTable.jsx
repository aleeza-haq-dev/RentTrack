import React from 'react'
import { StatusBadge } from '../common/StatusBadge'
import { formatCurrency, formatDate } from '../../lib/utils'
import { useData } from '../../context/DataContext'
import { ArrowUpRight, Receipt, PlusCircle } from 'lucide-react'

export const RecentPaymentsTable = ({ onNavigate, onRecordPayment }) => {
  const { stats, currency } = useData()
  const payments = stats.recentPayments

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Payments
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Latest rent collection entries
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('payments')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        {payments.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Receipt className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              No payments recorded yet
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
              Record a payment to track monthly revenue and collection history.
            </p>
            <button
              onClick={() => onRecordPayment()}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record First Payment</span>
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/70 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 font-medium">
              <tr>
                <th className="py-2.5 px-4">Tenant & Unit</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Method</th>
                <th className="py-2.5 px-4">Amount</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {p.tenantName}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {p.propertyName} • {p.unitNumber}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-300">
                    {formatDate(p.payment_date || p.due_date)}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                    {p.payment_method || 'Bank Transfer'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(p.amount, currency)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
