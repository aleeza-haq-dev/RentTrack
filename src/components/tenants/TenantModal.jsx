import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { useData } from '../../context/DataContext'
import { User, Mail, Phone, Calendar, DollarSign, Building } from 'lucide-react'

export const TenantModal = ({ isOpen, onClose, tenantToEdit = null }) => {
  const { addTenant, updateTenant, properties, units, currency } = useData()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [propertyId, setPropertyId] = useState('')
  const [unitId, setUnitId] = useState('')
  const [leaseStartDate, setLeaseStartDate] = useState('')
  const [leaseEndDate, setLeaseEndDate] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [rentDueDay, setRentDueDay] = useState('1')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [notes, setNotes] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Units filtered by chosen property
  const availableUnits = units.filter((u) => u.property_id === propertyId)

  useEffect(() => {
    if (tenantToEdit) {
      setFullName(tenantToEdit.full_name || '')
      setEmail(tenantToEdit.email || '')
      setPhone(tenantToEdit.phone || '')
      setPropertyId(tenantToEdit.property_id || '')
      setUnitId(tenantToEdit.unit_id || '')
      setLeaseStartDate(tenantToEdit.lease_start_date || '')
      setLeaseEndDate(tenantToEdit.lease_end_date || '')
      setMonthlyRent(tenantToEdit.monthly_rent ? String(tenantToEdit.monthly_rent) : '')
      setRentDueDay(tenantToEdit.rent_due_day ? String(tenantToEdit.rent_due_day) : '1')
      setEmergencyContact(tenantToEdit.emergency_contact || '')
      setNotes(tenantToEdit.notes || '')
      setIsActive(tenantToEdit.is_active !== undefined ? tenantToEdit.is_active : true)
    } else {
      setFullName('')
      setEmail('')
      setPhone('')
      setPropertyId(properties[0]?.id || '')
      setUnitId('')
      // Default dates: Today to 1 year from now
      const today = new Date().toISOString().split('T')[0]
      const nextYear = new Date()
      nextYear.setFullYear(nextYear.getFullYear() + 1)
      setLeaseStartDate(today)
      setLeaseEndDate(nextYear.toISOString().split('T')[0])
      setMonthlyRent('')
      setRentDueDay('1')
      setEmergencyContact('')
      setNotes('')
      setIsActive(true)
    }
    setErrorMsg('')
  }, [tenantToEdit, isOpen, properties])

  // When user selects a unit, automatically pre-fill rent from unit if available
  const handleUnitChange = (selectedUnitId) => {
    setUnitId(selectedUnitId)
    const unit = units.find((u) => u.id === selectedUnitId)
    if (unit && unit.monthly_rent) {
      setMonthlyRent(String(unit.monthly_rent))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setErrorMsg('Tenant full name is required')
      return
    }
    if (!leaseStartDate || !leaseEndDate) {
      setErrorMsg('Lease start and end dates are required')
      return
    }
    if (!monthlyRent || Number(monthlyRent) <= 0) {
      setErrorMsg('Monthly rent must be greater than 0')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        property_id: propertyId || null,
        unit_id: unitId || null,
        lease_start_date: leaseStartDate,
        lease_end_date: leaseEndDate,
        monthly_rent: Number(monthlyRent),
        rent_due_day: parseInt(rentDueDay, 10) || 1,
        emergency_contact: emergencyContact.trim(),
        notes: notes.trim(),
        is_active: isActive,
      }

      if (tenantToEdit) {
        await updateTenant(tenantToEdit.id, payload)
      } else {
        await addTenant(payload)
      }
      onClose()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save tenant')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tenantToEdit ? 'Edit Tenant' : 'Register New Tenant'}
      subtitle="Record lease agreement terms and property assignment"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
            {errorMsg}
          </div>
        )}

        {/* Tenant Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
            Tenant Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Contact Info (Email & Phone) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenant@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Property & Unit Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Assigned Property
            </label>
            <select
              value={propertyId}
              onChange={(e) => {
                setPropertyId(e.target.value)
                setUnitId('')
              }}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="">-- Select Property --</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Assigned Unit
            </label>
            <select
              value={unitId}
              onChange={(e) => handleUnitChange(e.target.value)}
              disabled={!propertyId}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:opacity-50"
            >
              <option value="">-- Select Unit --</option>
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.unit_number} {u.is_occupied ? '(Occupied)' : '(Vacant)'} - {currency}{u.monthly_rent}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lease Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Lease Start Date *
            </label>
            <input
              type="date"
              required
              value={leaseStartDate}
              onChange={(e) => setLeaseStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Lease End Date *
            </label>
            <input
              type="date"
              required
              value={leaseEndDate}
              onChange={(e) => setLeaseEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Monthly Rent & Due Day */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Monthly Rent ({currency}) *
            </label>
            <div className="relative">
              <span className="text-zinc-400 font-semibold absolute left-3 top-2 text-sm">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="1450.00"
                className="w-full pl-8 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Rent Due Day of Month
            </label>
            <select
              value={rentDueDay}
              onChange={(e) => setRentDueDay(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              {[1, 2, 3, 4, 5, 10, 15, 20, 25].map((day) => (
                <option key={day} value={day}>
                  {day}
                  {day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of each month
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
            Emergency Contact / Notes (Optional)
          </label>
          <input
            type="text"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            placeholder="e.g. John Doe (Parent) - (555) 123-4567"
            className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Active lease checkbox */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 border-zinc-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Active lease agreement
            </span>
          </label>
        </div>

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
            {isSubmitting ? 'Saving...' : tenantToEdit ? 'Save Changes' : 'Register Tenant'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
