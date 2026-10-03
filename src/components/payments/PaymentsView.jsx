import React, { useState } from 'react'
import { RecordPaymentModal } from './RecordPaymentModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { StatusBadge } from '../common/StatusBadge'
import { useData } from '../../context/DataContext'
import {
  formatCurrency,
  formatDate,
  getCurrentMonthYear,
  formatMonthYear,
} from '../../lib/utils'
import {
  CreditCard,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'

export const PaymentsView = ({
  isRecordModalOpen,
  setIsRecordModalOpen,
  recordInitialData,
}) => {
  const { payments, tenants, properties, units, deletePayment, currency } = useData()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'Paid' | 'Pending' | 'Overdue'
  const [monthFilter, setMonthFilter] = useState('') // '' for all, or 'YYYY-MM'
  const [paymentToEdit, setPaymentToEdit] = useState(null)
  const [paymentToDelete, setPaymentToDelete] = useState(null)

  const handleConfirmDelete = async () => {
    if (paymentToDelete) {
      await deletePayment(paymentToDelete.id)
      setPaymentToDelete(null)
    }
  }

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const tenant = tenants.find((t) => t.id === p.tenant_id)
    const property = properties.find((pr) => pr.id === p.property_id)
    const unit = units.find((u) => u.id === p.unit_id)

    const matchesSearch =
      (tenant && tenant.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (property && property.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (unit && unit.unit_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.reference_note && p.reference_note.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
    const matchesMonth = !monthFilter || p.month_year === monthFilter

    return matchesSearch && matchesStatus && matchesMonth
  })

  // Summary figures
  const totalAmount = filteredPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const totalPaid = filteredPayments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const totalOverdue = filteredPayments
    .filter((p) => p.status === 'Overdue')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  // Export to CSV function
  const handleExportCSV = () => {
    if (filteredPayments.length === 0) return

    const headers = [
      'Month',
      'Tenant Name',
      'Property',
      'Unit',
      'Amount',
      'Currency',
      'Due Date',
      'Payment Date',
      'Status',
      'Payment Method',
      'Reference Note',
    ]

    const rows = filteredPayments.map((p) => {
      const tenant = tenants.find((t) => t.id === p.tenant_id)
      const property = properties.find((pr) => pr.id === p.property_id)
      const unit = units.find((u) => u.id === p.unit_id)

      return [
        p.month_year,
        `"${tenant?.full_name || 'Unknown'}"`,
        `"${property?.name || 'Unassigned'}"`,
        `"${unit?.unit_number || 'N/A'}"`,
        p.amount,
        currency,
        p.due_date,
        p.payment_date || '',
        p.status,
        `"${p.payment_method || ''}"`,
        `"${(p.reference_note || '').replace(/"/g, '""')}"`,
      ]
    })

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `renttrack_payments_${monthFilter || 'all'}_${new Date().toISOString().split('T')[0]}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payments by tenant, property..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
            />
          </div>

          {/* Month selector */}
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
            title="Filter by month"
          />

          {monthFilter && (
            <button
              type="button"
              onClick={() => setMonthFilter('')}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
            >
              Clear month
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* CSV Export */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredPayments.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition shadow-sm disabled:opacity-50"
            title="Export filtered records to CSV"
          >
            <Download className="w-4 h-4 text-zinc-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Record Payment Button */}
          <button
            type="button"
            onClick={() => {
              setPaymentToEdit(null)
              setIsRecordModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs & Summary Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Records', count: payments.length },
            { id: 'Paid', label: 'Paid', count: payments.filter((p) => p.status === 'Paid').length },
            { id: 'Pending', label: 'Pending', count: payments.filter((p) => p.status === 'Pending').length },
            { id: 'Overdue', label: 'Overdue', count: payments.filter((p) => p.status === 'Overdue').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
          <span>
            Total Filtered: <strong className="text-zinc-900 dark:text-zinc-100">{formatCurrency(totalAmount, currency)}</strong>
          </span>
          {totalOverdue > 0 && (
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              Overdue: {formatCurrency(totalOverdue, currency)}
            </span>
          )}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {searchQuery || statusFilter !== 'ALL' || monthFilter
                ? 'No payments found matching criteria'
                : 'No payments recorded yet'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL' || monthFilter
                ? 'Try resetting the month selector or changing your search terms.'
                : 'Record your first monthly rent collection to track income and tenant status.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setPaymentToEdit(null)
                setIsRecordModalOpen(true)
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Rent Payment</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/70 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 font-semibold">
                <tr>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Tenant & Unit</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Paid Date</th>
                  <th className="py-3 px-4">Method & Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredPayments.map((p) => {
                  const tenant = tenants.find((t) => t.id === p.tenant_id)
                  const property = properties.find((pr) => pr.id === p.property_id)
                  const unit = units.find((u) => u.id === p.unit_id)

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        {p.month_year}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {tenant?.full_name || 'Unknown Tenant'}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {property?.name || '—'} • {unit?.unit_number || 'Unit'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100 text-sm whitespace-nowrap">
                        {formatCurrency(p.amount, currency)}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                        {formatDate(p.due_date)}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                        {p.payment_date ? formatDate(p.payment_date) : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 max-w-[200px]">
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">
                          {p.payment_method || 'Bank Transfer'}
                        </p>
                        {p.reference_note && (
                          <p className="text-[11px] text-zinc-400 truncate" title={p.reference_note}>
                            {p.reference_note}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={p.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentToEdit(p)
                              setIsRecordModalOpen(true)
                            }}
                            className="p-1.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Edit Payment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentToDelete(p)}
                            className="p-1.5 rounded text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Delete Payment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false)
          setPaymentToEdit(null)
        }}
        initialData={recordInitialData}
        paymentToEdit={paymentToEdit}
      />

      {/* Confirm Delete Payment Modal */}
      <ConfirmModal
        isOpen={Boolean(paymentToDelete)}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment Record"
        message="Are you sure you want to delete this payment record from the ledger?"
        confirmText="Delete Record"
      />
    </div>
  )
}
