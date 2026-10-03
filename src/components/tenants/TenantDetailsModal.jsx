import React from 'react'
import { Modal } from '../common/Modal'
import { StatusBadge } from '../common/StatusBadge'
import { formatCurrency, formatDate } from '../../lib/utils'
import { useData } from '../../context/DataContext'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Home,
  PlusCircle,
  Receipt,
  FileText,
  Clock,
} from 'lucide-react'

export const TenantDetailsModal = ({
  isOpen,
  onClose,
  tenant,
  onRecordPaymentForTenant,
}) => {
  const { properties, units, payments, currency } = useData()

  if (!tenant) return null

  const property = properties.find((p) => p.id === tenant.property_id)
  const unit = units.find((u) => u.id === tenant.unit_id)

  // Payments for this tenant
  const tenantPayments = payments.filter((p) => p.tenant_id === tenant.id)

  // Total collected for this tenant
  const totalPaid = tenantPayments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tenant.full_name}
      subtitle={`Tenant & Lease Profile • ${property?.name || 'Property'} (${unit?.unit_number || 'Unit'})`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Top Summary Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <Mail className="w-4 h-4 text-zinc-400" />
              {tenant.email ? (
                <a
                  href={`mailto:${tenant.email}`}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {tenant.email}
                </a>
              ) : (
                <span className="text-zinc-400">No email provided</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <Phone className="w-4 h-4 text-zinc-400" />
              {tenant.phone ? (
                <a
                  href={`tel:${tenant.phone}`}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {tenant.phone}
                </a>
              ) : (
                <span className="text-zinc-400">No phone provided</span>
              )}
            </div>

            {tenant.emergency_contact && (
              <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-300">
                <User className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Emergency:</strong> {tenant.emergency_contact}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 sm:border-l sm:border-zinc-200 sm:dark:border-zinc-700 sm:pl-4">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>
                <strong>Lease Term:</strong> {formatDate(tenant.lease_start_date)} –{' '}
                {formatDate(tenant.lease_end_date)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>
                <strong>Due Date:</strong> Day {tenant.rent_due_day || 1} of each month
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
              <Home className="w-4 h-4 text-emerald-600" />
              <span>
                Rent: {formatCurrency(tenant.monthly_rent, currency)} / month
              </span>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Payment History
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Total lifetime collected: {formatCurrency(totalPaid, currency)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose()
                onRecordPaymentForTenant(tenant)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record Rent</span>
            </button>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            {tenantPayments.length === 0 ? (
              <div className="py-8 text-center px-4">
                <Receipt className="w-6 h-6 mx-auto text-zinc-300 dark:text-zinc-600 mb-1" />
                <p className="text-xs font-medium text-zinc-500">
                  No rent payments recorded for this tenant yet
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {tenantPayments.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40"
                    >
                      <td className="py-2.5 px-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {p.month_year}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300">
                        {formatDate(p.payment_date || p.due_date)}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500 dark:text-zinc-400">
                        {p.payment_method || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(p.amount, currency)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
