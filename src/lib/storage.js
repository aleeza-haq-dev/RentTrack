import { supabase, isSupabaseConfigured } from './supabase'
import { getInitialData, DEMO_LANDLORD_ID } from './initialData'
import { generateUUID } from './utils'

const STORAGE_KEYS = {
  PROPERTIES: 'renttrack_properties',
  UNITS: 'renttrack_units',
  TENANTS: 'renttrack_tenants',
  PAYMENTS: 'renttrack_payments',
  PROFILES: 'renttrack_profiles',
}

// Local storage helpers
const getLocal = (key, landlordId) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const all = JSON.parse(raw)
    return Array.isArray(all) ? all.filter((item) => item.landlord_id === landlordId) : []
  } catch (e) {
    console.error(`Error reading ${key}`, e)
    return []
  }
}

const saveLocalAll = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch (e) {
    console.error(`Error saving ${key}`, e)
  }
}

const updateLocalList = (key, landlordId, updater) => {
  try {
    const raw = localStorage.getItem(key)
    const all = raw ? JSON.parse(raw) : []
    const otherLandlordsItems = all.filter((item) => item.landlord_id !== landlordId)
    const myItems = all.filter((item) => item.landlord_id === landlordId)
    const updatedMyItems = updater(myItems)
    saveLocalAll(key, [...otherLandlordsItems, ...updatedMyItems])
    return updatedMyItems
  } catch (e) {
    console.error(`Error updating local list ${key}`, e)
    return []
  }
}

// Initialize mock storage if empty
export const initializeLocalStorage = (landlordId = DEMO_LANDLORD_ID) => {
  const existingProps = localStorage.getItem(STORAGE_KEYS.PROPERTIES)
  if (!existingProps) {
    const initial = getInitialData(landlordId)
    saveLocalAll(STORAGE_KEYS.PROPERTIES, initial.properties)
    saveLocalAll(STORAGE_KEYS.UNITS, initial.units)
    saveLocalAll(STORAGE_KEYS.TENANTS, initial.tenants)
    saveLocalAll(STORAGE_KEYS.PAYMENTS, initial.rent_payments)

    const profiles = [{ ...initial.profile, id: landlordId }]
    saveLocalAll(STORAGE_KEYS.PROFILES, profiles)
  }
}

// ==========================================
// PROFILE SERVICES
// ==========================================
export const apiGetProfile = async (landlordId) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', landlordId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase profile fetch error:', error.message)
    }
    if (data) return data
  }

  // Fallback / Local
  const raw = localStorage.getItem(STORAGE_KEYS.PROFILES)
  const profiles = raw ? JSON.parse(raw) : []
  const found = profiles.find((p) => p.id === landlordId)
  if (found) return found

  const fallback = {
    id: landlordId,
    email: 'landlord@example.com',
    full_name: 'Landlord User',
    phone: '',
    company_name: '',
    currency: '$',
    date_format: 'YYYY-MM-DD',
  }
  saveLocalAll(STORAGE_KEYS.PROFILES, [...profiles, fallback])
  return fallback
}

export const apiUpdateProfile = async (landlordId, updates) => {
  const updatedPayload = { ...updates, id: landlordId, updated_at: new Date().toISOString() }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(updatedPayload)
      .select()
      .single()
    if (error) throw error
    return data
  }

  // Local
  const raw = localStorage.getItem(STORAGE_KEYS.PROFILES)
  const profiles = raw ? JSON.parse(raw) : []
  const index = profiles.findIndex((p) => p.id === landlordId)
  let updated
  if (index >= 0) {
    updated = { ...profiles[index], ...updatedPayload }
    profiles[index] = updated
  } else {
    updated = updatedPayload
    profiles.push(updated)
  }
  saveLocalAll(STORAGE_KEYS.PROFILES, profiles)
  return updated
}

// ==========================================
// PROPERTIES SERVICES
// ==========================================
export const apiGetProperties = async (landlordId) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('properties')
      .select('*, units(*)')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase getProperties error:', error.message)
    } else {
      return data || []
    }
  }

  // Local
  initializeLocalStorage(landlordId)
  const props = getLocal(STORAGE_KEYS.PROPERTIES, landlordId)
  const units = getLocal(STORAGE_KEYS.UNITS, landlordId)

  // Attach units to properties for convenience
  return props.map((prop) => ({
    ...prop,
    units: units.filter((u) => u.property_id === prop.id),
  }))
}

export const apiCreateProperty = async (landlordId, propertyData) => {
  const newProp = {
    id: generateUUID(),
    landlord_id: landlordId,
    ...propertyData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('properties')
      .insert([newProp])
      .select()
      .single()
    if (error) throw error
    return { ...data, units: [] }
  }

  // Local
  updateLocalList(STORAGE_KEYS.PROPERTIES, landlordId, (items) => [newProp, ...items])
  return { ...newProp, units: [] }
}

export const apiUpdateProperty = async (landlordId, propertyId, updates) => {
  const updatedData = { ...updates, updated_at: new Date().toISOString() }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('properties')
      .update(updatedData)
      .eq('id', propertyId)
      .eq('landlord_id', landlordId)
      .select('*, units(*)')
      .single()
    if (error) throw error
    return data
  }

  // Local
  let result = null
  updateLocalList(STORAGE_KEYS.PROPERTIES, landlordId, (items) =>
    items.map((item) => {
      if (item.id === propertyId) {
        result = { ...item, ...updatedData }
        return result
      }
      return item
    })
  )
  const units = getLocal(STORAGE_KEYS.UNITS, landlordId).filter((u) => u.property_id === propertyId)
  return { ...result, units }
}

export const apiDeleteProperty = async (landlordId, propertyId) => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('landlord_id', landlordId)
    if (error) throw error
    return true
  }

  // Local cascade delete (Property -> Units -> Tenants unassigned)
  updateLocalList(STORAGE_KEYS.PROPERTIES, landlordId, (items) =>
    items.filter((item) => item.id !== propertyId)
  )
  updateLocalList(STORAGE_KEYS.UNITS, landlordId, (items) =>
    items.filter((item) => item.property_id !== propertyId)
  )
  updateLocalList(STORAGE_KEYS.TENANTS, landlordId, (items) =>
    items.map((t) => (t.property_id === propertyId ? { ...t, property_id: null, unit_id: null } : t))
  )
  return true
}

// ==========================================
// UNITS SERVICES
// ==========================================
export const apiGetUnits = async (landlordId) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('units')
      .select('*, properties(name)')
      .eq('landlord_id', landlordId)
      .order('unit_number', { ascending: true })

    if (error) {
      console.warn('Supabase getUnits error:', error.message)
    } else {
      return data || []
    }
  }

  initializeLocalStorage(landlordId)
  return getLocal(STORAGE_KEYS.UNITS, landlordId)
}

export const apiCreateUnit = async (landlordId, unitData) => {
  const newUnit = {
    id: generateUUID(),
    landlord_id: landlordId,
    monthly_rent: Number(unitData.monthly_rent) || 0,
    bedrooms: Number(unitData.bedrooms) || 1,
    bathrooms: Number(unitData.bathrooms) || 1,
    is_occupied: Boolean(unitData.is_occupied),
    ...unitData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('units').insert([newUnit]).select().single()
    if (error) throw error
    return data
  }

  updateLocalList(STORAGE_KEYS.UNITS, landlordId, (items) => [...items, newUnit])
  return newUnit
}

export const apiUpdateUnit = async (landlordId, unitId, updates) => {
  const updatedData = {
    ...updates,
    monthly_rent: updates.monthly_rent !== undefined ? Number(updates.monthly_rent) : undefined,
    bedrooms: updates.bedrooms !== undefined ? Number(updates.bedrooms) : undefined,
    bathrooms: updates.bathrooms !== undefined ? Number(updates.bathrooms) : undefined,
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('units')
      .update(updatedData)
      .eq('id', unitId)
      .eq('landlord_id', landlordId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  let result = null
  updateLocalList(STORAGE_KEYS.UNITS, landlordId, (items) =>
    items.map((item) => {
      if (item.id === unitId) {
        result = { ...item, ...updatedData }
        return result
      }
      return item
    })
  )
  return result
}

export const apiDeleteUnit = async (landlordId, unitId) => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', unitId)
      .eq('landlord_id', landlordId)
    if (error) throw error
    return true
  }

  updateLocalList(STORAGE_KEYS.UNITS, landlordId, (items) => items.filter((item) => item.id !== unitId))
  updateLocalList(STORAGE_KEYS.TENANTS, landlordId, (items) =>
    items.map((t) => (t.unit_id === unitId ? { ...t, unit_id: null } : t))
  )
  return true
}

// ==========================================
// TENANTS SERVICES
// ==========================================
export const apiGetTenants = async (landlordId) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*, properties(name), units(unit_number)')
      .eq('landlord_id', landlordId)
      .order('full_name', { ascending: true })

    if (error) {
      console.warn('Supabase getTenants error:', error.message)
    } else {
      return data || []
    }
  }

  initializeLocalStorage(landlordId)
  return getLocal(STORAGE_KEYS.TENANTS, landlordId)
}

export const apiCreateTenant = async (landlordId, tenantData) => {
  const newTenant = {
    id: generateUUID(),
    landlord_id: landlordId,
    monthly_rent: Number(tenantData.monthly_rent) || 0,
    rent_due_day: Number(tenantData.rent_due_day) || 1,
    is_active: tenantData.is_active !== undefined ? tenantData.is_active : true,
    ...tenantData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('tenants').insert([newTenant]).select().single()
    if (error) throw error

    // Sync unit occupancy
    if (newTenant.unit_id && newTenant.is_active) {
      await supabase.from('units').update({ is_occupied: true }).eq('id', newTenant.unit_id)
    }
    return data
  }

  // Local
  updateLocalList(STORAGE_KEYS.TENANTS, landlordId, (items) => [...items, newTenant])

  // Mark assigned unit as occupied
  if (newTenant.unit_id && newTenant.is_active) {
    updateLocalList(STORAGE_KEYS.UNITS, landlordId, (units) =>
      units.map((u) => (u.id === newTenant.unit_id ? { ...u, is_occupied: true } : u))
    )
  }

  return newTenant
}

export const apiUpdateTenant = async (landlordId, tenantId, updates) => {
  const updatedData = {
    ...updates,
    monthly_rent: updates.monthly_rent !== undefined ? Number(updates.monthly_rent) : undefined,
    rent_due_day: updates.rent_due_day !== undefined ? Number(updates.rent_due_day) : undefined,
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('tenants')
      .update(updatedData)
      .eq('id', tenantId)
      .eq('landlord_id', landlordId)
      .select()
      .single()
    if (error) throw error

    // Sync unit occupancy if unit changed
    if (updatedData.unit_id) {
      await supabase.from('units').update({ is_occupied: true }).eq('id', updatedData.unit_id)
    }
    return data
  }

  // Local
  let oldUnitId = null
  let result = null

  updateLocalList(STORAGE_KEYS.TENANTS, landlordId, (items) =>
    items.map((item) => {
      if (item.id === tenantId) {
        oldUnitId = item.unit_id
        result = { ...item, ...updatedData }
        return result
      }
      return item
    })
  )

  // Sync unit occupancy
  if (updatedData.unit_id && updatedData.unit_id !== oldUnitId) {
    updateLocalList(STORAGE_KEYS.UNITS, landlordId, (units) =>
      units.map((u) => {
        if (u.id === updatedData.unit_id) return { ...u, is_occupied: true }
        if (u.id === oldUnitId) return { ...u, is_occupied: false }
        return u
      })
    )
  }

  return result
}

export const apiDeleteTenant = async (landlordId, tenantId) => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', tenantId)
      .eq('landlord_id', landlordId)
    if (error) throw error
    return true
  }

  let deletedUnitId = null
  updateLocalList(STORAGE_KEYS.TENANTS, landlordId, (items) =>
    items.filter((item) => {
      if (item.id === tenantId) {
        deletedUnitId = item.unit_id
        return false
      }
      return true
    })
  )

  // If unit was occupied by this tenant, mark it vacant
  if (deletedUnitId) {
    const remainingTenants = getLocal(STORAGE_KEYS.TENANTS, landlordId)
    const hasOtherTenant = remainingTenants.some((t) => t.unit_id === deletedUnitId && t.is_active)
    if (!hasOtherTenant) {
      updateLocalList(STORAGE_KEYS.UNITS, landlordId, (units) =>
        units.map((u) => (u.id === deletedUnitId ? { ...u, is_occupied: false } : u))
      )
    }
  }

  return true
}

// ==========================================
// RENT PAYMENTS SERVICES
// ==========================================
export const apiGetPayments = async (landlordId) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('rent_payments')
      .select('*, tenants(full_name), properties(name), units(unit_number)')
      .eq('landlord_id', landlordId)
      .order('due_date', { ascending: false })

    if (error) {
      console.warn('Supabase getPayments error:', error.message)
    } else {
      return data || []
    }
  }

  initializeLocalStorage(landlordId)
  return getLocal(STORAGE_KEYS.PAYMENTS, landlordId)
}

export const apiCreatePayment = async (landlordId, paymentData) => {
  const newPayment = {
    id: generateUUID(),
    landlord_id: landlordId,
    amount: Number(paymentData.amount) || 0,
    status: paymentData.status || 'Paid',
    payment_method: paymentData.payment_method || 'Bank Transfer',
    ...paymentData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('rent_payments').insert([newPayment]).select().single()
    if (error) throw error
    return data
  }

  updateLocalList(STORAGE_KEYS.PAYMENTS, landlordId, (items) => [newPayment, ...items])
  return newPayment
}

export const apiUpdatePayment = async (landlordId, paymentId, updates) => {
  const updatedData = {
    ...updates,
    amount: updates.amount !== undefined ? Number(updates.amount) : undefined,
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('rent_payments')
      .update(updatedData)
      .eq('id', paymentId)
      .eq('landlord_id', landlordId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  let result = null
  updateLocalList(STORAGE_KEYS.PAYMENTS, landlordId, (items) =>
    items.map((item) => {
      if (item.id === paymentId) {
        result = { ...item, ...updatedData }
        return result
      }
      return item
    })
  )
  return result
}

export const apiDeletePayment = async (landlordId, paymentId) => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('rent_payments')
      .delete()
      .eq('id', paymentId)
      .eq('landlord_id', landlordId)
    if (error) throw error
    return true
  }

  updateLocalList(STORAGE_KEYS.PAYMENTS, landlordId, (items) =>
    items.filter((item) => item.id !== paymentId)
  )
  return true
}

// Reset data to initial demo set
export const resetDemoData = (landlordId = DEMO_LANDLORD_ID) => {
  const initial = getInitialData(landlordId)
  updateLocalList(STORAGE_KEYS.PROPERTIES, landlordId, () => initial.properties)
  updateLocalList(STORAGE_KEYS.UNITS, landlordId, () => initial.units)
  updateLocalList(STORAGE_KEYS.TENANTS, landlordId, () => initial.tenants)
  updateLocalList(STORAGE_KEYS.PAYMENTS, landlordId, () => initial.rent_payments)
  return initial
}
