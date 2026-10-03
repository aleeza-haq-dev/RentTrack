import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { useData } from '../../context/DataContext'
import { Home, DollarSign } from 'lucide-react'

export const UnitModal = ({
  isOpen,
  onClose,
  propertyId,
  unitToEdit = null,
}) => {
  const { addUnit, updateUnit, currency, properties } = useData()
  const [unitNumber, setUnitNumber] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [bedrooms, setBedrooms] = useState('1')
  const [bathrooms, setBathrooms] = useState('1.0')
  const [isOccupied, setIsOccupied] = useState(false)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const property = properties.find((p) => p.id === propertyId)

  useEffect(() => {
    if (unitToEdit) {
      setUnitNumber(unitToEdit.unit_number || '')
      setMonthlyRent(unitToEdit.monthly_rent ? String(unitToEdit.monthly_rent) : '')
      setBedrooms(unitToEdit.bedrooms ? String(unitToEdit.bedrooms) : '1')
      setBathrooms(unitToEdit.bathrooms ? String(unitToEdit.bathrooms) : '1.0')
      setIsOccupied(Boolean(unitToEdit.is_occupied))
      setNotes(unitToEdit.notes || '')
    } else {
      setUnitNumber('')
      setMonthlyRent('')
      setBedrooms('1')
      setBathrooms('1.0')
      setIsOccupied(false)
      setNotes('')
    }
    setErrorMsg('')
  }, [unitToEdit, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!unitNumber.trim()) {
      setErrorMsg('Unit name or number is required')
      return
    }
    if (!monthlyRent || Number(monthlyRent) <= 0) {
      setErrorMsg('Please enter a valid monthly rent amount')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const payload = {
        property_id: propertyId,
        unit_number: unitNumber.trim(),
        monthly_rent: Number(monthlyRent),
        bedrooms: parseInt(bedrooms, 10) || 1,
        bathrooms: parseFloat(bathrooms) || 1.0,
        is_occupied: isOccupied,
        notes: notes.trim(),
      }

      if (unitToEdit) {
        await updateUnit(unitToEdit.id, payload)
      } else {
        await addUnit(payload)
      }
      onClose()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save unit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={unitToEdit ? 'Edit Unit' : 'Add Unit to Property'}
      subtitle={`Adding to ${property?.name || 'Property'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
            Unit Number / Name *
          </label>
          <div className="relative">
            <Home className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              placeholder="e.g. Apt 101, Unit B, Main House"
              className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
            Monthly Rent ({currency}) *
          </label>
          <div className="relative">
            <span className="text-zinc-400 font-semibold absolute left-3.5 top-2 text-sm">
              {currency}
            </span>
            <input
              type="number"
              step="0.01"
              required
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              placeholder="1500.00"
              className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Bedrooms
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="0">Studio / 0 Bed</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Bathrooms
            </label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="1.0">1 Bath</option>
              <option value="1.5">1.5 Bath</option>
              <option value="2.0">2 Bath</option>
              <option value="2.5">2.5 Bath</option>
              <option value="3.0">3+ Bath</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={isOccupied}
              onChange={(e) => setIsOccupied(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 border-zinc-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Mark unit as currently occupied
            </span>
          </label>
          <p className="text-[11px] text-zinc-400 ml-6">
            Assigning a tenant to this unit will also automatically set it as occupied.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
            Unit Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Amenities, parking space number, square footage..."
            className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
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
            {isSubmitting ? 'Saving...' : unitToEdit ? 'Save Changes' : 'Add Unit'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
