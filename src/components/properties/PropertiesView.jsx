import React, { useState } from 'react'
import { PropertyCard } from './PropertyCard'
import { PropertyModal } from './PropertyModal'
import { UnitModal } from './UnitModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { useData } from '../../context/DataContext'
import { Building2, Plus, Search, Filter, Home } from 'lucide-react'

export const PropertiesView = ({ isAddPropertyModalOpen, setIsAddPropertyModalOpen }) => {
  const { properties, deleteProperty, deleteUnit } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  // Edit / Delete states
  const [propertyToEdit, setPropertyToEdit] = useState(null)
  const [propertyToDelete, setPropertyToDelete] = useState(null)
  const [unitToDelete, setUnitToDelete] = useState(null)

  // Unit modal states
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)
  const [unitToEdit, setUnitToEdit] = useState(null)

  // Handlers
  const handleOpenAddUnit = (propertyId) => {
    setSelectedPropertyId(propertyId)
    setUnitToEdit(null)
    setIsUnitModalOpen(true)
  }

  const handleOpenEditUnit = (unit) => {
    setSelectedPropertyId(unit.property_id)
    setUnitToEdit(unit)
    setIsUnitModalOpen(true)
  }

  const handleConfirmDeleteProperty = async () => {
    if (propertyToDelete) {
      await deleteProperty(propertyToDelete.id)
      setPropertyToDelete(null)
    }
  }

  const handleConfirmDeleteUnit = async () => {
    if (unitToDelete) {
      await deleteUnit(unitToDelete.id)
      setUnitToDelete(null)
    }
  }

  // Filtered properties
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'ALL' || p.property_type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by name or address..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
          >
            <option value="ALL">All Property Types</option>
            <option value="Single Family">Single Family</option>
            <option value="Multi-Family">Multi-Family</option>
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setPropertyToEdit(null)
            setIsAddPropertyModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Properties List / Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center shadow-sm">
          <Building2 className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {searchQuery || typeFilter !== 'ALL'
              ? 'No properties match your filter'
              : 'No properties added yet'}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
            {searchQuery || typeFilter !== 'ALL'
              ? 'Try changing your search keyword or clearing the property type filter.'
              : 'Add your first rental property to begin organizing units, tracking occupancy, and assigning tenants.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setPropertyToEdit(null)
              setIsAddPropertyModalOpen(true)
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onEditProperty={(p) => {
                setPropertyToEdit(p)
                setIsAddPropertyModalOpen(true)
              }}
              onDeleteProperty={(p) => setPropertyToDelete(p)}
              onAddUnit={handleOpenAddUnit}
              onEditUnit={handleOpenEditUnit}
              onDeleteUnit={(u) => setUnitToDelete(u)}
            />
          ))}
        </div>
      )}

      {/* Property Modal */}
      <PropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => {
          setIsAddPropertyModalOpen(false)
          setPropertyToEdit(null)
        }}
        propertyToEdit={propertyToEdit}
      />

      {/* Unit Modal */}
      <UnitModal
        isOpen={isUnitModalOpen}
        onClose={() => {
          setIsUnitModalOpen(false)
          setUnitToEdit(null)
        }}
        propertyId={selectedPropertyId}
        unitToEdit={unitToEdit}
      />

      {/* Confirm Delete Property */}
      <ConfirmModal
        isOpen={Boolean(propertyToDelete)}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={handleConfirmDeleteProperty}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyToDelete?.name}"? All units and associated data inside this property will also be removed.`}
        confirmText="Delete Property"
      />

      {/* Confirm Delete Unit */}
      <ConfirmModal
        isOpen={Boolean(unitToDelete)}
        onClose={() => setUnitToDelete(null)}
        onConfirm={handleConfirmDeleteUnit}
        title="Delete Unit"
        message={`Are you sure you want to delete unit "${unitToDelete?.unit_number}"?`}
        confirmText="Delete Unit"
      />
    </div>
  )
}
