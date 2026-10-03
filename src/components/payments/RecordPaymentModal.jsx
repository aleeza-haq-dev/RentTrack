import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { useData } from '../../context/DataContext'
import { getCurrentMonthYear, calculatePaymentStatus } from '../../lib/utils'
import { DollarSign, Calendar, CreditCard, User, AlertCircle } from 'lucide-react'

export const RecordPaymentModal = ({
  isOpen,
  onClose,
  initialData = null,
  paymentToEdit = null,
}) => {
  const { addPayment, updatePayment, tenants, properties, units, currency } = useData()

  const [tenantId, setTenantId] = useState('')
  const [monthYear, setMonthYear] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('Paid')
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer')
  const [referenceNote, setReferenceNote] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (paymentToEdit) {
      setTenantId(paymentToEdit.tenant_id || '')
      setMonthYear(paymentToEdit.month_year || getCurrentMonthYear())
      setAmount(paymentToEdit.amount ? String(paymentToEdit.amount) : '')
      setPaymentDate(paymentToEdit.payment_date || '')
      setDueDate(paymentToEdit.due_date || '')
      setStatus(paymentToEdit.status || 'Paid')
      setPaymentMethod(paymentToEdit.payment_method || 'Bank Transfer')
      setReferenceNote(paymentToEdit.reference_note || '')
    } else {
      const selectedTenantId = initialData?.tenant_id || (tenants[0]?.id || '')
      setTenantId(selectedTenantId)

      const tenant = tenants.find((t) => t.id === selectedTenantId)
      const currentMonth = getCurrentMonthYear()
      setMonthYear(currentMonth)

      const today = new Date().toISOString().split('T')[0]
      setPaymentDate(today)

      const dueDay = tenant?.rent_due_day || 1
      const dueDayStr = String(dueDay).padStart(2, '0')
      setDueDate(`${currentMonth}-${dueDayStr}`)

      const rentAmount = initialData?.amount || tenant?.monthly_rent || ''
      setAmount(rentAmount ? String(rentAmount) : '')
      setStatus('Paid')
      setPaymentMethod('Bank Transfer')
      setReferenceNote('')
    }
    setErrorMsg('')
  }, [paymentToEdit, initialData, isOpen, tenants])

  // When tenant is selected, auto-fill their monthly rent and calculate due date
  const handleTenantChange = (selectedId) => {
    setTenantId(selectedId)
    const tenant = tenants.find((t) => t.id === selectedId)
    if (tenant) {
      setAmount(String(tenant.monthly_rent || ''))
      const dueDay = String(tenant.rent_due_day || 1).padStart(2, '0')
      const targetMonth = monthYear || getCurrentMonthYear()
      setDueDate(`${targetMonth}-${dueDay}`)
    }
  }

  // When month changes, update due date accordingly
  const handleMonthChange = (e) => {
    const newMonth = e.target.value
    setMonthYear(newMonth)
    const tenant = tenants.find((t) => t.id === tenantId)
    const dueDay = String(tenant?.rent_due_day || 1).padStart(2, '0')
    setDueDate(`${newMonth}-${dueDay}`)
  }

  // Auto calculate status helper if user toggles payment date
  const handleAutoStatus = (newStatus) => {
    setStatus(newStatus)
    if (newStatus === 'Paid' && !paymentDate) {
      setPaymentDate(new Date().toISOString().split('T')[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tenantId) {
      setErrorMsg('Please select a tenant')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMsg('Please enter a valid payment amount')
      return
    }
    if (!monthYear) {
      setErrorMsg('Please select a payment month')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const selectedTenant = tenants.find((t) => t.id === tenantId)

      const payload = {
        tenant_id: tenantId,
        property_id: selectedTenant?.property_id || null,
        unit_id: selectedTenant?.unit_id || null,
        month_year: monthYear,
        amount: Number(amount),
        payment_date: status === 'Paid' ? (paymentDate || new Date().toISOString().split('T')[0]) : paymentDate || null,
        due_date: dueDate || `${monthYear}-01`,
        status,
        payment_method: paymentMethod,
        reference_note: referenceNote.trim(),
      }

      if (paymentToEdit) {
        await updatePayment(paymentToEdit.id, payload)
      } else {
        await addPayment(payload)
      }
      onClose()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={paymentToEdit ? 'Edit Rent Payment' : 'Record Rent Payment'}
      subtitle="Track collection status, payment method, and amount"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
            {errorMsg}
          </div>
        )}

        {/* Tenant Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
            Select Tenant *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <select
              required
              value={tenantId}
              onChange={(e) => handleTenantChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="">-- Choose Tenant --</option>
              {tenants.map((t) => {
                const property = properties.find((p) => p.id === t.property_id)
                const unit = units.find((u) => u.id === t.unit_id)
                return (
                  <option key={t.id} value={t.id}>
                    {t.full_name} ({property?.name || 'Property'} • {unit?.unit_number || 'Unit'})
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* Month & Amount */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Payment Month *
            </label>
            <input
              type="month"
              required
              value={monthYear}
              onChange={handleMonthChange}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Amount ({currency}) *
            </label>
            <div className="relative">
              <span className="text-zinc-400 font-semibold absolute left-3 top-2 text-sm">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1500.00"
                className="w-full pl-8 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Status & Method */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Payment Status
            </label>
            <select
              value={status}
              onChange={(e) => handleAutoStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="Paid">Paid (Received)</option>
              <option value="Pending">Pending (Awaiting)</option>
              <option value="Overdue">Overdue (Past Due)</option>
              <option value="Partial">Partial Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="Bank Transfer">Bank Transfer / ACH</option>
              <option value="Zelle">Zelle</option>
              <option value="Venmo">Venmo / PayPal</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="Online">Online Portal</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Due Date & Payment Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Rent Due Date
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Date Received
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              disabled={status === 'Pending' || status === 'Overdue'}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Reference / Note */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
            Reference / Notes (Optional)
          </label>
          <input
            type="text"
            value={referenceNote}
            onChange={(e) => setReferenceNote(e.target.value)}
            placeholder="e.g. Check #1042, ACH transfer ref, reminder sent on 2nd"
            className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : paymentToEdit ? 'Update Payment' : 'Save Payment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
