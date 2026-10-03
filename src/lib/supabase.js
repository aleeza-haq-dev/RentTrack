import { createClient } from '@supabase/supabase-js'

// Get credentials from env or user settings in localStorage
const getSavedConfig = () => {
  try {
    const raw = localStorage.getItem('renttrack_supabase_config')
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Error reading saved supabase config', e)
  }
  return null
}

const savedConfig = getSavedConfig()
const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const SUPABASE_URL =
  savedConfig?.url && savedConfig.url.startsWith('https://')
    ? savedConfig.url
    : envUrl

export const SUPABASE_ANON_KEY =
  savedConfig?.anonKey && savedConfig.anonKey.length > 20
    ? savedConfig.anonKey
    : envKey

export const isSupabaseConfigured = () => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_URL.includes('your-project') &&
    !SUPABASE_ANON_KEY.includes('your-anon-key')
  )
}

let supabaseInstance = null

if (isSupabaseConfigured()) {
  try {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
  }
}

export const supabase = supabaseInstance

export const verifySupabaseConnection = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      message: 'Supabase credentials not configured or incomplete.',
    }
  }
  try {
    const { error } = await supabase.auth.getSession()
    if (error) {
      return { success: false, message: error.message }
    }
    return { success: true, message: 'Connected to Supabase project successfully.' }
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' }
  }
}

export const saveSupabaseConfig = (url, anonKey) => {
  if (!url || !anonKey) {
    localStorage.removeItem('renttrack_supabase_config')
  } else {
    localStorage.setItem(
      'renttrack_supabase_config',
      JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
    )
  }
  window.location.reload()
}
