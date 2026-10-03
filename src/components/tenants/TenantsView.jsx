import React, { useState } from 'react'
import { TenantModal } from './TenantModal'
import { TenantDetailsModal } from './TenantDetailsModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { StatusBadge } from '../common/StatusBadge'
import { useData } from '../../context/DataContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  DollarSign,
  PlusCircle,
  Home,
} from 'lucide-react'

export const TenantsView = ({
  isAddTenantModalOpen,
  setIsAddTenantModalOpen,
  onOpenRecordPayment,
}) => {
  const { tenants, properties, units, deleteTenant, currency } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'ACTIVE' | 'INACTIVE'

  const [selectedTenantForDetails, setSelectedTenantForDetails] = useState(null)
  const [tenantToEdit, setTenantToEdit] = useState(null)
  const [tenantToDelete, setTenantToDelete] = useState(null)

  const handleConfirmDelete = async () => {
    if (tenantToDelete) {
      await deleteTenant(tenantToDelete.id)
      setTenantToDelete(null)
    }
  }

  // Filtered tenants
  const filteredTenants = tenants.filter((t) => {
    const property = properties.find((p) => p.id === t.property_id)
    const unit = units.find((u) => u.id === t.unit_id)

    const matchesSearch =
      t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.phone && t.phone.includes(searchQuery)) ||
      (property && property.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (unit && unit.unit_number.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? t.is_active
        : !t.is_active

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Search & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tenant name, phone, unit..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
          >
            <option value="ALL">All Leases</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive / Past</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setTenantToEdit(null)
            setIsAddTenantModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tenant</span>
        </button>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        {filteredTenants.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {searchQuery || statusFilter !== 'ALL'
                ? 'No tenants match your search'
                : 'No tenants registered yet'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try searching by a different name or clearing status filters.'
                : 'Add tenants to assign them to property units, set monthly rent amounts, and track lease due dates.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setTenantToEdit(null)
                setIsAddTenantModalOpen(true)
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register First Tenant</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/70 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 font-semibold">
                <tr>
                  <th className="py-3 px-4">Tenant Name</th>
                  <th className="py-3 px-4">Assigned Unit</th>
                  <th className="py-3 px-4">Monthly Rent</th>
                  <th className="py-3 px-4">Due Day</th>
                  <th className="py-3 px-4">Lease Term</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredTenants.map((t) => {
                  const property = properties.find((p) => p.id === t.property_id)
                  const unit = units.find((u) => u.id === t.unit_id)

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200 dark:border-emerald-800">
                            {t.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedTenantForDetails(t)}
                              className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline text-left block text-sm"
                            >
                              {t.full_name}
                            </button>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                              {t.email && <span>{t.email}</span>}
                              {t.phone && <span>• {t.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">
                          {unit ? unit.unit_number : 'No Unit Assigned'}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {property ? property.name : '—'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(t.monthly_rent, currency)}
                        <span className="text-[10px] text-zinc-400 font-normal">/mo</span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300">
                        Day {t.rent_due_day || 1}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 text-[11px]">
                        <div>{formatDate(t.lease_start_date)}</div>
                        <div className="text-zinc-400">to {formatDate(t.lease_end_date)}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            t.is_active
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          {t.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenRecordPayment({
                                tenant_id: t.id,
                                amount: t.monthly_rent,
                              })
                            }
                            className="p-1.5 rounded text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                            title="Record Payment for Tenant"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedTenantForDetails(t)}
                            className="p-1.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="View Tenant & Payments"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTenantToEdit(t)
                              setIsAddTenantModalOpen(true)
                            }}
                            className="p-1.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Edit Tenant"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setTenantToDelete(t)}
                            className="p-1.5 rounded text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Delete Tenant"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Tenant Modal */}
      <TenantModal
        isOpen={isAddTenantModalOpen}
        onClose={() => {
          setIsAddTenantModalOpen(false)
          setTenantToEdit(null)
        }}
        tenantToEdit={tenantToEdit}
      />

      {/* Tenant Details Modal */}
      <TenantDetailsModal
        isOpen={Boolean(selectedTenantForDetails)}
        onClose={() => setSelectedTenantForDetails(null)}
        tenant={selectedTenantForDetails}
        onRecordPaymentForTenant={(tenant) => {
          onOpenRecordPayment({
            tenant_id: tenant.id,
            amount: tenant.monthly_rent,
          })
        }}
      />

      {/* Confirm Delete Tenant Modal */}
      <ConfirmModal
        isOpen={Boolean(tenantToDelete)}
        onClose={() => setTenantToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Tenant"
        message={`Are you sure you want to remove tenant "${tenantToDelete?.full_name}"? Their assigned unit will become vacant.`}
        confirmText="Remove Tenant"
      />
    </div>
  )
}
