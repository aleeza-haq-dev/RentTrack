import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useAuth } from './AuthContext'
import {
  apiGetProperties,
  apiCreateProperty,
  apiUpdateProperty,
  apiDeleteProperty,
  apiGetUnits,
  apiCreateUnit,
  apiUpdateUnit,
  apiDeleteUnit,
  apiGetTenants,
  apiCreateTenant,
  apiUpdateTenant,
  apiDeleteTenant,
  apiGetPayments,
  apiCreatePayment,
  apiUpdatePayment,
  apiDeletePayment,
  apiUpdateProfile,
  resetDemoData,
} from '../lib/storage'
import { getCurrentMonthYear, calculatePaymentStatus } from '../lib/utils'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const { user, profile, updateProfileState } = useAuth()
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [tenants, setTenants] = useState([])
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Load all data whenever active user changes
  const loadData = async () => {
    if (!user) {
      setProperties([])
      setUnits([])
      setTenants([])
      setPayments([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const [propsData, unitsData, tenantsData, paymentsData] = await Promise.all([
        apiGetProperties(user.id),
        apiGetUnits(user.id),
        apiGetTenants(user.id),
        apiGetPayments(user.id),
      ])

      setProperties(propsData || [])
      setUnits(unitsData || [])
      setTenants(tenantsData || [])
      setPayments(paymentsData || [])
    } catch (err) {
      console.error('Failed to load landlord data:', err)
      setError(err.message || 'Failed to load landlord records')
      addToast('Failed to load records from database', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  // ==========================================
  // PROPERTY ACTIONS
  // ==========================================
  const addProperty = async (data) => {
    try {
      const created = await apiCreateProperty(user.id, data)
      setProperties((prev) => [created, ...prev])
      addToast(`Property "${data.name}" added successfully`)
      return created
    } catch (err) {
      addToast(err.message || 'Error adding property', 'error')
      throw err
    }
  }

  const updateProperty = async (id, updates) => {
    try {
      const updated = await apiUpdateProperty(user.id, id, updates)
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)))
      addToast('Property updated successfully')
      return updated
    } catch (err) {
      addToast(err.message || 'Error updating property', 'error')
      throw err
    }
  }

  const deleteProperty = async (id) => {
    try {
      await apiDeleteProperty(user.id, id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
      setUnits((prev) => prev.filter((u) => u.property_id !== id))
      setTenants((prev) =>
        prev.map((t) => (t.property_id === id ? { ...t, property_id: null, unit_id: null } : t))
      )
      addToast('Property removed successfully')
      return true
    } catch (err) {
      addToast(err.message || 'Error deleting property', 'error')
      throw err
    }
  }

  // ==========================================
  // UNIT ACTIONS
  // ==========================================
  const addUnit = async (data) => {
    try {
      const created = await apiCreateUnit(user.id, data)
      setUnits((prev) => [...prev, created])
      // Also update parent property's nested units if cached
      setProperties((prev) =>
        prev.map((p) =>
          p.id === data.property_id
            ? { ...p, units: [...(p.units || []), created] }
            : p
        )
      )
      addToast(`Unit "${data.unit_number}" added`)
      return created
    } catch (err) {
      addToast(err.message || 'Error adding unit', 'error')
      throw err
    }
  }

  const updateUnit = async (id, updates) => {
    try {
      const updated = await apiUpdateUnit(user.id, id, updates)
      setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)))
      setProperties((prev) =>
        prev.map((p) => ({
          ...p,
          units: (p.units || []).map((u) => (u.id === id ? { ...u, ...updated } : u)),
        }))
      )
      addToast('Unit updated')
      return updated
    } catch (err) {
      addToast(err.message || 'Error updating unit', 'error')
      throw err
    }
  }

  const deleteUnit = async (id) => {
    try {
      await apiDeleteUnit(user.id, id)
      setUnits((prev) => prev.filter((u) => u.id !== id))
      setProperties((prev) =>
        prev.map((p) => ({
          ...p,
          units: (p.units || []).filter((u) => u.id !== id),
        }))
      )
      setTenants((prev) =>
        prev.map((t) => (t.unit_id === id ? { ...t, unit_id: null } : t))
      )
      addToast('Unit deleted')
      return true
    } catch (err) {
      addToast(err.message || 'Error deleting unit', 'error')
      throw err
    }
  }

  // ==========================================
  // TENANT ACTIONS
  // ==========================================
  const addTenant = async (data) => {
    try {
      const created = await apiCreateTenant(user.id, data)
      setTenants((prev) => [...prev, created])

      if (data.unit_id) {
        setUnits((prev) =>
          prev.map((u) => (u.id === data.unit_id ? { ...u, is_occupied: true } : u))
        )
      }
      addToast(`Tenant "${data.full_name}" registered`)
      return created
    } catch (err) {
      addToast(err.message || 'Error adding tenant', 'error')
      throw err
    }
  }

  const updateTenant = async (id, updates) => {
    try {
      const updated = await apiUpdateTenant(user.id, id, updates)
      const oldTenant = tenants.find((t) => t.id === id)

      setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)))

      // Sync unit occupancy
      if (updates.unit_id && updates.unit_id !== oldTenant?.unit_id) {
        setUnits((prev) =>
          prev.map((u) => {
            if (u.id === updates.unit_id) return { ...u, is_occupied: true }
            if (u.id === oldTenant?.unit_id) return { ...u, is_occupied: false }
            return u
          })
        )
      }

      addToast('Tenant details updated')
      return updated
    } catch (err) {
      addToast(err.message || 'Error updating tenant', 'error')
      throw err
    }
  }

  const deleteTenant = async (id) => {
    try {
      const tenant = tenants.find((t) => t.id === id)
      await apiDeleteTenant(user.id, id)
      setTenants((prev) => prev.filter((t) => t.id !== id))

      if (tenant?.unit_id) {
        setUnits((prev) =>
          prev.map((u) => (u.id === tenant.unit_id ? { ...u, is_occupied: false } : u))
        )
      }
      addToast('Tenant removed')
      return true
    } catch (err) {
      addToast(err.message || 'Error removing tenant', 'error')
      throw err
    }
  }

  // ==========================================
  // PAYMENT ACTIONS
  // ==========================================
  const addPayment = async (data) => {
    try {
      const created = await apiCreatePayment(user.id, data)
      setPayments((prev) => [created, ...prev])
      addToast(`Payment recorded: $${Number(data.amount).toLocaleString()}`)
      return created
    } catch (err) {
      addToast(err.message || 'Error recording payment', 'error')
      throw err
    }
  }

  const updatePayment = async (id, updates) => {
    try {
      const updated = await apiUpdatePayment(user.id, id, updates)
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)))
      addToast('Payment record updated')
      return updated
    } catch (err) {
      addToast(err.message || 'Error updating payment', 'error')
      throw err
    }
  }

  const deletePayment = async (id) => {
    try {
      await apiDeletePayment(user.id, id)
      setPayments((prev) => prev.filter((p) => p.id !== id))
      addToast('Payment record deleted')
      return true
    } catch (err) {
      addToast(err.message || 'Error deleting payment', 'error')
      throw err
    }
  }

  // ==========================================
  // PROFILE / SETTINGS ACTIONS
  // ==========================================
  const updateLandlordProfile = async (updates) => {
    try {
      const updated = await apiUpdateProfile(user.id, updates)
      updateProfileState(updated)
      addToast('Settings saved successfully')
      return updated
    } catch (err) {
      addToast(err.message || 'Error updating settings', 'error')
      throw err
    }
  }

  const resetToSampleData = () => {
    if (!user) return
    const initial = resetDemoData(user.id)
    setProperties(initial.properties)
    setUnits(initial.units)
    setTenants(initial.tenants)
    setPayments(initial.rent_payments)
    addToast('Sample rental data restored successfully')
  }

  // ==========================================
  // CALCULATED METRICS & REMINDERS
  // ==========================================
  const stats = useMemo(() => {
    const currentMonthKey = getCurrentMonthYear()
    const now = new Date()
    const currentDay = now.getDate()

    const totalProperties = properties.length
    const totalUnits = units.length
    const occupiedUnits = units.filter((u) => u.is_occupied).length
    const vacantUnits = totalUnits - occupiedUnits
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0
    const totalTenants = tenants.filter((t) => t.is_active).length

    // Expected rent from active tenants
    const expectedMonthlyRent = tenants
      .filter((t) => t.is_active)
      .reduce((sum, t) => sum + (Number(t.monthly_rent) || 0), 0)

    // Current month payments
    const currentMonthPayments = payments.filter((p) => p.month_year === currentMonthKey)

    const collectedRent = currentMonthPayments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

    const overdueRent = currentMonthPayments
      .filter((p) => p.status === 'Overdue')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

    const pendingRent = currentMonthPayments
      .filter((p) => p.status === 'Pending')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

    // Recent payments (sorted by date or created_at desc)
    const recentPayments = [...payments]
      .sort((a, b) => new Date(b.payment_date || b.created_at) - new Date(a.payment_date || a.created_at))
      .slice(0, 5)
      .map((p) => {
        const tenant = tenants.find((t) => t.id === p.tenant_id)
        const property = properties.find((pr) => pr.id === p.property_id)
        const unit = units.find((u) => u.id === p.unit_id)
        return {
          ...p,
          tenantName: tenant?.full_name || 'Unknown Tenant',
          propertyName: property?.name || 'Unassigned Property',
          unitNumber: unit?.unit_number || 'N/A',
        }
      })

    // Upcoming rent due dates (active tenants)
    const upcomingDue = tenants
      .filter((t) => t.is_active)
      .map((t) => {
        const dueDay = t.rent_due_day || 1
        const property = properties.find((p) => p.id === t.property_id)
        const unit = units.find((u) => u.id === t.unit_id)
        const existingPayment = currentMonthPayments.find((p) => p.tenant_id === t.id)

        // Calculate days until due
        const daysDiff = dueDay - currentDay
        const calculatedStatus = existingPayment
          ? existingPayment.status
          : calculatePaymentStatus(dueDay, currentMonthKey)

        return {
          tenantId: t.id,
          tenantName: t.full_name,
          phone: t.phone,
          email: t.email,
          propertyName: property?.name || 'Unassigned',
          unitNumber: unit?.unit_number || 'N/A',
          amount: t.monthly_rent,
          dueDay,
          daysDiff,
          status: calculatedStatus,
          isPaid: existingPayment?.status === 'Paid',
          paymentId: existingPayment?.id || null,
        }
      })
      .sort((a, b) => a.dueDay - b.dueDay)

    // Smart Reminders Breakdown
    const overdueReminders = []
    const dueSoonReminders = []
    const pendingReminders = []
    const expiringLeases = []

    // 1. Check each active tenant for rent reminders
    upcomingDue.forEach((item) => {
      if (item.status === 'Overdue') {
        overdueReminders.push({
          id: `reminder-overdue-${item.tenantId}`,
          type: 'overdue',
          title: `Overdue: ${item.tenantName}`,
          description: `Rent was due on day ${item.dueDay} of this month.`,
          amount: item.amount,
          tenantId: item.tenantId,
          tenantName: item.tenantName,
          unitInfo: `${item.propertyName} • ${item.unitNumber}`,
          phone: item.phone,
          email: item.email,
          dueDay: item.dueDay,
        })
      } else if (item.status === 'Pending') {
        if (item.daysDiff >= 0 && item.daysDiff <= 5) {
          dueSoonReminders.push({
            id: `reminder-duesoon-${item.tenantId}`,
            type: 'due_soon',
            title: `Due Soon: ${item.tenantName}`,
            description: item.daysDiff === 0 ? 'Rent is due today!' : `Rent is due in ${item.daysDiff} day(s).`,
            amount: item.amount,
            tenantId: item.tenantId,
            tenantName: item.tenantName,
            unitInfo: `${item.propertyName} • ${item.unitNumber}`,
            phone: item.phone,
            email: item.email,
            dueDay: item.dueDay,
          })
        } else {
          pendingReminders.push({
            id: `reminder-pending-${item.tenantId}`,
            type: 'pending',
            title: `Pending: ${item.tenantName}`,
            description: `Rent scheduled for day ${item.dueDay}.`,
            amount: item.amount,
            tenantId: item.tenantId,
            tenantName: item.tenantName,
            unitInfo: `${item.propertyName} • ${item.unitNumber}`,
            phone: item.phone,
            email: item.email,
            dueDay: item.dueDay,
          })
        }
      }
    })

    // 2. Check expiring leases (next 60 days)
    tenants
      .filter((t) => t.is_active && t.lease_end_date)
      .forEach((t) => {
        const endDate = new Date(t.lease_end_date)
        const diffMs = endDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays >= 0 && diffDays <= 60) {
          const property = properties.find((p) => p.id === t.property_id)
          const unit = units.find((u) => u.id === t.unit_id)
          expiringLeases.push({
            id: `reminder-lease-${t.id}`,
            type: 'lease_expiring',
            title: `Lease Ending: ${t.full_name}`,
            description: `Lease expires in ${diffDays} days (${t.lease_end_date}).`,
            amount: t.monthly_rent,
            tenantId: t.id,
            tenantName: t.full_name,
            unitInfo: `${property?.name || 'Property'} • ${unit?.unit_number || 'Unit'}`,
            phone: t.phone,
            email: t.email,
            diffDays,
          })
        }
      })

    const allReminders = [
      ...overdueReminders,
      ...dueSoonReminders,
      ...pendingReminders,
      ...expiringLeases,
    ]

    return {
      totalProperties,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate,
      totalTenants,
      expectedMonthlyRent,
      collectedRent,
      pendingRent,
      overdueRent,
      recentPayments,
      upcomingDue,
      reminders: allReminders,
      overdueCount: overdueReminders.length,
      dueSoonCount: dueSoonReminders.length,
      pendingCount: pendingReminders.length,
      expiringLeaseCount: expiringLeases.length,
    }
  }, [properties, units, tenants, payments])

  return (
    <DataContext.Provider
      value={{
        properties,
        units,
        tenants,
        payments,
        currency: profile?.currency || '$',
        profile,
        isLoading,
        error,
        toasts,
        addToast,
        removeToast,
        loadData,
        // Actions
        addProperty,
        updateProperty,
        deleteProperty,
        addUnit,
        updateUnit,
        deleteUnit,
        addTenant,
        updateTenant,
        deleteTenant,
        addPayment,
        updatePayment,
        deletePayment,
        updateLandlordProfile,
        resetToSampleData,
        // Computed metrics
        stats,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
