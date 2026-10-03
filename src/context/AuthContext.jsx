import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { apiGetProfile } from '../lib/storage'
import { DEMO_LANDLORD_ID } from '../lib/initialData'

const AuthContext = createContext()

const DEMO_USER = {
  id: DEMO_LANDLORD_ID,
  email: 'landlord@renttrack.io',
  user_metadata: {
    full_name: 'David Reynolds',
  },
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoUser, setIsDemoUser] = useState(false)

  // Initialize auth
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      setIsLoading(true)

      // 1. If Supabase is configured, check real session
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && mounted) {
            setUser(session.user)
            setIsDemoUser(false)
            const prof = await apiGetProfile(session.user.id)
            setProfile(prof)
            setIsLoading(false)
            return
          }
        } catch (err) {
          console.error('Error fetching Supabase session:', err)
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return
            if (session?.user) {
              setUser(session.user)
              setIsDemoUser(false)
              const prof = await apiGetProfile(session.user.id)
              setProfile(prof)
            } else {
              // Only clear if not in local demo session
              const localAuth = localStorage.getItem('renttrack_local_auth')
              if (!localAuth) {
                setUser(null)
                setProfile(null)
              }
            }
          }
        )

        // If no supabase session, check if user had a local/demo session saved
        const localAuth = localStorage.getItem('renttrack_local_auth')
        if (localAuth && mounted) {
          try {
            const saved = JSON.parse(localAuth)
            setUser(saved.user)
            setIsDemoUser(saved.isDemo || false)
            const prof = await apiGetProfile(saved.user.id)
            setProfile(prof)
          } catch (e) {
            console.error('Failed to parse local auth', e)
          }
        }

        if (mounted) setIsLoading(false)
        return () => subscription?.unsubscribe()
      }

      // 2. Standalone / Local mode
      const localAuth = localStorage.getItem('renttrack_local_auth')
      if (localAuth) {
        try {
          const parsed = JSON.parse(localAuth)
          setUser(parsed.user)
          setIsDemoUser(parsed.isDemo || false)
          const prof = await apiGetProfile(parsed.user.id)
          setProfile(prof)
        } catch (e) {
          console.error('Error loading local auth', e)
        }
      }

      if (mounted) setIsLoading(false)
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])

  // Sign in with email/password
  const signIn = async (email, password) => {
    setIsLoading(true)
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) throw error

        setUser(data.user)
        setIsDemoUser(false)
        localStorage.removeItem('renttrack_local_auth')
        const prof = await apiGetProfile(data.user.id)
        setProfile(prof)
        return { user: data.user, error: null }
      }

      // Local / Offline authentication simulation
      const localUsersRaw = localStorage.getItem('renttrack_users')
      const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : []
      const found = localUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      )

      if (!found && email !== 'landlord@renttrack.io') {
        throw new Error('Invalid email or password. Use demo login or create a new account.')
      }

      const simulatedUser = found
        ? {
            id: found.id,
            email: found.email,
            user_metadata: { full_name: found.full_name },
          }
        : DEMO_USER

      setUser(simulatedUser)
      setIsDemoUser(!found)
      localStorage.setItem(
        'renttrack_local_auth',
        JSON.stringify({ user: simulatedUser, isDemo: !found })
      )

      const prof = await apiGetProfile(simulatedUser.id)
      setProfile(prof)
      return { user: simulatedUser, error: null }
    } catch (err) {
      console.error('Login error:', err)
      return { user: null, error: err.message || 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up new landlord
  const signUp = async (email, password, fullName) => {
    setIsLoading(true)
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        })
        if (error) throw error

        if (data.user) {
          setUser(data.user)
          setIsDemoUser(false)
          localStorage.removeItem('renttrack_local_auth')
          const prof = await apiGetProfile(data.user.id)
          setProfile(prof)
        }
        return { user: data.user, session: data.session, error: null }
      }

      // Local mode sign up
      const localUsersRaw = localStorage.getItem('renttrack_users')
      const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : []
      const exists = localUsers.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      )
      if (exists) {
        throw new Error('An account with this email already exists.')
      }

      const newUserId = 'user_' + Date.now()
      const newUserRecord = {
        id: newUserId,
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        created_at: new Date().toISOString(),
      }
      localUsers.push(newUserRecord)
      localStorage.setItem('renttrack_users', JSON.stringify(localUsers))

      const simulatedUser = {
        id: newUserId,
        email: email.trim(),
        user_metadata: { full_name: fullName.trim() },
      }

      setUser(simulatedUser)
      setIsDemoUser(false)
      localStorage.setItem(
        'renttrack_local_auth',
        JSON.stringify({ user: simulatedUser, isDemo: false })
      )

      const prof = await apiGetProfile(newUserId)
      setProfile(prof)
      return { user: simulatedUser, error: null }
    } catch (err) {
      console.error('Sign up error:', err)
      return { user: null, error: err.message || 'Registration failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Quick Demo Login
  const signInAsDemo = async () => {
    setIsLoading(true)
    try {
      setUser(DEMO_USER)
      setIsDemoUser(true)
      localStorage.setItem(
        'renttrack_local_auth',
        JSON.stringify({ user: DEMO_USER, isDemo: true })
      )
      const prof = await apiGetProfile(DEMO_USER.id)
      setProfile(prof)
      return { user: DEMO_USER, error: null }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    setIsLoading(true)
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut()
      }
      localStorage.removeItem('renttrack_local_auth')
      setUser(null)
      setProfile(null)
      setIsDemoUser(false)
    } catch (err) {
      console.error('Sign out error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfileState = (newProfile) => {
    setProfile(newProfile)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: Boolean(user),
        isLoading,
        isDemoUser,
        isConfigured: isSupabaseConfigured(),
        signIn,
        signUp,
        signInAsDemo,
        signOut,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
