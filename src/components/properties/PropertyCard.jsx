import React, { useState } from 'react'
import { StatusBadge } from '../common/StatusBadge'
import { formatCurrency } from '../../lib/utils'
import { useData } from '../../context/DataContext'
import {
  Building2,
  MapPin,
  Home,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-react'

export const PropertyCard = ({
  property,
  onEditProperty,
  onDeleteProperty,
  onAddUnit,
  onEditUnit,
  onDeleteUnit,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const { units, tenants, currency } = useData()

  // Get units for this property
  const propUnits = units.filter((u) => u.property_id === property.id)
  const occupiedCount = propUnits.filter((u) => u.is_occupied).length
  const vacantCount = propUnits.length - occupiedCount
  const totalRent = propUnits.reduce((acc, u) => acc + (Number(u.monthly_rent) || 0), 0)

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Property Header */}
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {property.name}
                </h3>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {property.property_type || 'Single Family'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>
                {property.address}, {property.city}
                {property.state ? `, ${property.state}` : ''} {property.zip_code}
              </span>
            </div>

            {property.notes && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 italic pt-1">
                "{property.notes}"
              </p>
            )}
          </div>

          {/* Quick stats and Actions */}
          <div className="flex items-center gap-2 self-end sm:self-start">
            <button
              type="button"
              onClick={() => onAddUnit(property.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition border border-zinc-200 dark:border-zinc-700"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Unit</span>
            </button>

            <button
              type="button"
              onClick={() => onEditProperty(property)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
              title="Edit Property"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onDeleteProperty(property)}
              className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
              title="Delete Property"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Units</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
              {propUnits.length}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Occupancy</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {occupiedCount}/{propUnits.length} ({propUnits.length > 0 ? Math.round((occupiedCount / propUnits.length) * 100) : 0}%)
            </span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Monthly Rent</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              {formatCurrency(totalRent, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Units Toggle Section */}
      <div className="px-5 py-2.5 bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
        >
          <span>Units in this Property ({propUnits.length})</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Units Table / List */}
      {isExpanded && (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {propUnits.length === 0 ? (
            <div className="py-8 text-center px-4">
              <Home className="w-6 h-6 mx-auto text-zinc-300 dark:text-zinc-600 mb-1" />
              <p className="text-xs font-medium text-zinc-500">No units added yet</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Add units to track rent amounts, occupancy, and assign tenants.
              </p>
              <button
                type="button"
                onClick={() => onAddUnit(property.id)}
                className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 rounded border border-emerald-200 dark:border-emerald-800"
              >
                <Plus className="w-3 h-3" />
                <span>Add First Unit</span>
              </button>
            </div>
          ) : (
            propUnits.map((unit) => {
              const assignedTenant = tenants.find((t) => t.unit_id === unit.id && t.is_active)

              return (
                <div
                  key={unit.id}
                  className="p-3.5 sm:px-5 flex items-center justify-between gap-3 text-xs hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {unit.unit_number}
                      </span>
                      <StatusBadge status={unit.is_occupied ? 'occupied' : 'vacant'} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-zinc-400">
                      <span>{unit.bedrooms} Bed, {unit.bathrooms} Bath</span>
                      {assignedTenant ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          • <User className="w-3 h-3" /> {assignedTenant.full_name}
                        </span>
                      ) : (
                        <span>• Ready for tenant</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                      {formatCurrency(unit.monthly_rent, currency)}
                      <span className="text-[10px] text-zinc-400 font-normal">/mo</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => onEditUnit(unit)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
                      title="Edit Unit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteUnit(unit)}
                      className="p-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                      title="Delete Unit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
